import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getLevelById, validateAnswer } from "../../../../packages/shared/levels";
import { API_ENDPOINTS } from "../config/api";
import "../styles/index.css";
import { commandResponses } from "./commands";

const STORAGE_KEY = "obscura_console_history_v1";

const Console = ({ className = "", onSubmit, userData = null, currentLevel = 1, onUserDataUpdate = null }) => {
	const [history, setHistory] = useState([]);
	const [input, setInput] = useState("");
	const [navIndex, setNavIndex] = useState(-1);
	const [cursorVisible, setCursorVisible] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const containerRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setHistory(JSON.parse(raw));
		} catch (err) {
			// ignore
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
		} catch (err) {
			// ignore
		}
	}, [history]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCursorVisible((v) => !v);
		}, 530);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop =
				containerRef.current.scrollHeight;
		}
	}, [history, input]);

	const push = (text) => {
		const entry = {
			id: Date.now(),
			text,
			ts: new Date().toISOString()
		};
		setHistory((h) => [...h, entry]);
		if (onSubmit) onSubmit(text);
	};

	// process input as command
	const processCommand = async (commandText) => {
		const trimmed = commandText.trim();

		// Check if it's a command
		if (!trimmed.startsWith("/")) {
			return false;
		}

		setIsProcessing(true);

		const parts = trimmed.slice(1).split(" ");
		const command = parts[0].toLowerCase();
		const args = parts.slice(1).join(" ");

		// Handle /hint command with credit system
		if (command === "hint") {
			if (!userData) {
				const responses = [
					{ text: "[!] Error: User data not available", delay: 100 }
				];
				addDelayedResponses(responses);
				setIsProcessing(false);
				return true;
			}

			const hintsRemaining = userData.hintsRemaining || 0;

			if (hintsRemaining <= 0) {
				const responses = [
					{ text: "[!] No hint credits remaining.", delay: 100 },
					{ text: "[!] Maximum of 3 hints per session.", delay: 150 }
				];
				addDelayedResponses(responses);
				setIsProcessing(false);
				return true;
			}

			const level = getLevelById(currentLevel);
			if (!level) {
				const responses = [
					{ text: "[!] Error: Level data not found", delay: 100 }
				];
				addDelayedResponses(responses);
				setIsProcessing(false);
				return true;
			}

			const hintPoem = level.hintPoem || "[!] No hint available for this level";
			const responses = [
				{ text: "[*] Retrieving hint...", delay: 200 },
				{ text: `[+] Hint Credits Used: 1 (${hintsRemaining - 1} remaining)`, delay: 150 },
				{ text: hintPoem, delay: 300 }
			];

			addDelayedResponses(responses);

			// Call backend to update hint credits
			try {
				const response = await axios.post(API_ENDPOINTS.GAME_HINT || "/api/game/hint", {
					username: userData.username,
					levelId: currentLevel
				});
				
				// Update App.jsx with new userData
				if (response.data && onUserDataUpdate) {
					onUserDataUpdate(response.data);
				}
			} catch (error) {
				console.error("Failed to update hint credits:", error);
			}

			setIsProcessing(false);
			return true;
		}

		// Handle /decrypt command - validate answer and show story fragment
		if (command === "decrypt" && args) {
			const level = getLevelById(currentLevel);
			if (!level) {
				const responses = [
					{ text: "[!] Error: Level data not found", delay: 100 }
				];
				addDelayedResponses(responses);
				setIsProcessing(false);
				return true;
			}

			const isCorrect = validateAnswer(currentLevel, args);

			if (isCorrect) {
				const storyFragment = level.storyFragment || "[+] Level completed!";
				const responses = [
					{ text: "[*] Validating answer...", delay: 300 },
					{ text: "[+] CORRECT!", delay: 250 },
					{ text: storyFragment, delay: 400 }
				];

				addDelayedResponses(responses);

				// Call backend to mark level as complete and advance
				try {
					const response = await axios.post(API_ENDPOINTS.GAME_ANSWER || "/api/game/answer", {
						username: userData.username,
						levelId: currentLevel,
						answer: args
					});
					
					// Update App.jsx with new userData
					if (response.data && onUserDataUpdate) {
						onUserDataUpdate(response.data);
					}
				} catch (error) {
					console.error("Failed to submit answer:", error);
				}

				setIsProcessing(false);
				return true;
			} else {
				const responses = [
					{ text: "[*] Validating answer...", delay: 300 },
					{ text: "[!] INCORRECT.", delay: 250 }
				];
				addDelayedResponses(responses);
				setIsProcessing(false);
				return true;
			}
		}

		if (command === "echo" && args) {
			const responses = [{ text: ` ${args}`, delay: 100 }];
			addDelayedResponses(responses);
			setIsProcessing(false);
			return true;
		}

		// Handle predefined commands
		if (commandResponses[command]) {
			addDelayedResponses(commandResponses[command]);
			setIsProcessing(false);
			return true;
		}

		// Unknown command
		const unknownResponse = [
			{ text: `Command not found: /${command}`, delay: 100 },
			{ text: "Type '/help' for available commands", delay: 150 }
		];
		addDelayedResponses(unknownResponse);
		setIsProcessing(false);
		return true;
	};

	// Add multiple messages with delays
	const addDelayedResponses = (responses) => {
		responses.forEach((response, index) => {
			setTimeout(
				() => {
					push(response.text);
				},
				responses
					.slice(0, index)
					.reduce((sum, r) => sum + r.delay, response.delay)
			);
		});
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (input.trim() !== "") {
				push(input.trim());
				// Process as command if starts with "/"
				processCommand(input.trim());
				setInput("");
				setNavIndex(-1);
			}
			return;
		}

		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (history.length === 0) return;
			setNavIndex((i) => {
				const next =
					i === -1 ? history.length - 1 : Math.max(0, i - 1);
				setInput(history[next].text);
				return next;
			});
			return;
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setNavIndex((i) => {
				if (i === -1) return -1;
				const next = i >= history.length - 1 ? -1 : i + 1;
				setInput(next === -1 ? "" : history[next].text);
				return next;
			});
			return;
		}
	};

	const handleClear = () => {
		setHistory([]);
		localStorage.removeItem(STORAGE_KEY);
		setInput("");
		setNavIndex(-1);
		inputRef.current?.focus();
	};

	return (
		<div className={`h-full w-full font-mono ${className}`}>
			<div
				ref={containerRef}
				className="console scrollbar-thin h-[70vh] overflow-y-auto bg-black p-4 text-sm text-green-400"
				onClick={() => inputRef.current?.focus()}
				style={{
					cursor: "text",
					minHeight: "300px",
					maxHeight: "80vh"
				}}>
				{history.map((h) => (
					<div
						key={h.id}
						className="break-words whitespace-pre-wrap">
						<span className="select-none">&gt; </span>
						{h.text}
					</div>
				))}

				<div className="break-words whitespace-pre-wrap">
					<span className="select-none">&gt; </span>
					{input}
					<span
						className={`-mb-1 inline-block h-4 w-2 bg-green-400 ${cursorVisible ? "opacity-100" : "opacity-0"}`}
					/>
				</div>

				<input
					ref={inputRef}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className="absolute h-0 w-0 opacity-0 outline-none"
					autoFocus
				/>
			</div>
		</div>
	);
};

export default Console;
