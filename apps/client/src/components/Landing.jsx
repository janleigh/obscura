import axios from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { saveSession } from "../utils/session";

const STEP_WELCOME = 0;
const STEP_USERNAME = 1;
const STEP_LOADING = 2;
const STEP_NEW_USER = 3;
const STEP_COMPLETE = 4;

const Landing = ({ onComplete }) => {
	const [step, setStep] = useState(STEP_WELCOME);
	const [username, setUsername] = useState("");
	const [realName, setRealName] = useState("");
	const [showCursor, setShowCursor] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [tutorialText, setTutorialText] = useState("");
	const [typingIndex, setTypingIndex] = useState(0);

	// Cursor blink
	useEffect(() => {
		const cursorInterval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, 500);
		return () => clearInterval(cursorInterval);
	}, []);

	// tutorial text typing effect
	useEffect(() => {
		const messages = {
			[STEP_WELCOME]:
				"Welcome to OBSCURA. Press any key to begin linguistic calibration...",
			[STEP_USERNAME]:
				"Enter your system identifier to access the network.",
			[STEP_NEW_USER]:
				"New candidate detected. Please provide your designation for records."
		};

		const message = messages[step];
		if (message && typingIndex < message.length) {
			const timer = setTimeout(() => {
				setTutorialText(message.substring(0, typingIndex + 1));
				setTypingIndex(typingIndex + 1);
			}, 30);
			return () => clearTimeout(timer);
		}
	}, [step, typingIndex]);

	// Reset typing when step changes
	useEffect(() => {
		setTypingIndex(0);
		setTutorialText("");
	}, [step]);

	// Check if user exists (login) or create new user (register)
	const handleUsernameSubmit = async () => {
		if (!username.trim()) return;

		setIsLoading(true);
		setError(null);
		setStep(STEP_LOADING);

		try {
			// Try to login first
			const response = await axios.post(API_ENDPOINTS.GAME_START, {
				username: username.trim()
			});

			const userData = response.data;
			console.log("Login response:", userData);

			// Check if realName is missing (new user or incomplete registration)
			if (!userData.realName) {
				// User exists but needs to provide real name
				console.log(
					"User missing real name, requesting designation"
				);
				setStep(STEP_NEW_USER);
				setIsLoading(false);
			} else if (userData.userId) {
				// Complete user with realName - proceed to game
				saveSession(userData);
				setStep(STEP_COMPLETE);
				setTimeout(() => onComplete(userData), 1000);
			} else {
				// Unexpected response
				setError("Unexpected server response");
				setStep(STEP_USERNAME);
				setIsLoading(false);
			}
		} catch (err) {
			console.error("Login error:", err);
			setError(err.response?.data?.error || "Connection failed");
			setStep(STEP_USERNAME);
			setIsLoading(false);
		}
	};

	// Register new user with full name
	const handleRegistration = async () => {
		if (!realName.trim()) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axios.post(API_ENDPOINTS.GAME_START, {
				username: username.trim(),
				realName: realName.trim()
			});

			const userData = response.data;
			saveSession(userData);
			setStep(STEP_COMPLETE);
			setTimeout(() => onComplete(userData), 1000);
		} catch (err) {
			console.error("Registration error:", err);
			setError(
				err.response?.data?.error || "Failed to connect to server"
			);
			setIsLoading(false);
		}
	};

	// Handle keyboard input
	const handleKeyDown = (e) => {
		if (step === STEP_WELCOME && e.key) {
			setStep(STEP_USERNAME);
			return;
		}

		if (e.key === "Enter") {
			if (step === STEP_USERNAME && username.trim() && !isLoading) {
				handleUsernameSubmit();
			} else if (
				step === STEP_NEW_USER &&
				realName.trim() &&
				!isLoading
			) {
				handleRegistration();
			}
		}

		// ESC to go back
		if (e.key === "Escape") {
			if (step === STEP_NEW_USER) {
				setStep(STEP_USERNAME);
				setRealName("");
			}
		}
	};

	return (
		<div
			className="font-kode-mono crt-screen fixed inset-0 bg-[#0a0a0a] text-sm"
			onKeyDown={handleKeyDown}
			tabIndex={0}>
			<div className="flex min-h-screen w-full items-center justify-center p-8">
				<div className="w-full max-w-2xl">
					{/* Welcome Screen */}
					{step === STEP_WELCOME && (
						<div className="crt-glow animate-fade-in space-y-8 text-center">
							<div className="space-y-4">
								<div className="text-4xl tracking-wider text-cyan-400">
									OBSCURA
								</div>
								<div className="text-xs text-gray-500">
									LINGUISTIC CALIBRATION INTERFACE
									v2.19.5
								</div>
							</div>
							<div className="mx-auto max-w-md space-y-4 text-gray-400">
								<div className="border-l-2 border-cyan-400 pl-4 text-left text-xs leading-relaxed">
									{tutorialText}
									{typingIndex < 70 && showCursor && (
										<span className="text-cyan-400">
											█
										</span>
									)}
								</div>
							</div>
							<div className="pt-8 text-xs text-gray-600">
								<span className="animate-pulse">
									[ PRESS ANY KEY TO BEGIN ]
								</span>
							</div>
						</div>
					)}

					{/* Username Input */}
					{step === STEP_USERNAME && (
						<div className="crt-glow animate-fade-in">
							<div className="mb-8 border border-gray-800 bg-[#0f0f0f] p-6">
								<div className="mb-6 border-b border-gray-800 pb-4">
									<span className="text-cyan-400">
										OBSCURA
									</span>
									<span className="text-gray-600">
										{" "}
										/{" "}
									</span>
									<span className="text-white">
										AUTHENTICATION
									</span>
								</div>

								{/* Tutorial text */}
								<div className="mb-6 border-l-2 border-cyan-400 pl-4 text-xs text-gray-400">
									{tutorialText}
									{typingIndex < 60 && showCursor && (
										<span className="text-cyan-400">
											█
										</span>
									)}
								</div>

								{/* Username input */}
								<div className="space-y-4">
									<label className="block text-xs text-gray-500">
										SYSTEM IDENTIFIER
									</label>
									<div className="flex items-center border-b border-gray-700 bg-transparent pb-2">
										<span className="mr-2 text-cyan-400">
											→
										</span>
										<input
											type="text"
											value={username}
											onChange={(e) =>
												setUsername(e.target.value)
											}
											onKeyDown={handleKeyDown}
											disabled={isLoading}
											className="flex-1 border-none bg-transparent text-white outline-none disabled:text-gray-600"
											autoFocus
											maxLength={32}
											placeholder="enter_username"
										/>
										{!isLoading && showCursor && (
											<span className="ml-1 text-cyan-400">
												█
											</span>
										)}
									</div>
								</div>

								{/* Instructions */}
								<div className="mt-6 text-right text-xs text-gray-600">
									<span className="text-gray-500">
										PRESS
									</span>{" "}
									<kbd className="rounded border border-gray-700 bg-[#1a1a1a] px-2 py-1 text-gray-400">
										ENTER
									</kbd>{" "}
									<span className="text-gray-500">
										TO AUTHENTICATE
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Loading */}
					{step === STEP_LOADING && (
						<div className="crt-glow animate-fade-in text-center">
							<div className="space-y-4">
								<div className="text-yellow-300">
									[ CONNECTING TO OBSCURA NETWORK... ]
								</div>
								<div className="text-xs text-gray-600">
									<span className="animate-pulse">
										Verifying credentials
									</span>
								</div>
							</div>
						</div>
					)}

					{/* New User Registration */}
					{step === STEP_NEW_USER && (
						<div className="crt-glow animate-fade-in">
							<div className="mb-8 border border-gray-800 bg-[#0f0f0f] p-6">
								<div className="mb-6 border-b border-gray-800 pb-4">
									<span className="text-cyan-400">
										OBSCURA
									</span>
									<span className="text-gray-600">
										{" "}
										/{" "}
									</span>
									<span className="text-white">
										NEW CANDIDATE
									</span>
								</div>

								{/* Tutorial text */}
								<div className="mb-6 border-l-2 border-yellow-300 pl-4 text-xs text-gray-400">
									{tutorialText}
									{typingIndex < 70 && showCursor && (
										<span className="text-yellow-300">
											█
										</span>
									)}
								</div>

								{/* Username display */}
								<div className="mb-4 space-y-2">
									<label className="block text-xs text-gray-600">
										SYSTEM IDENTIFIER
									</label>
									<div className="text-cyan-400">
										→ {username}
									</div>
								</div>

								{/* Real name input */}
								<div className="space-y-4">
									<label className="block text-xs text-gray-500">
										CANDIDATE DESIGNATION
									</label>
									<div className="flex items-center border-b border-gray-700 bg-transparent pb-2">
										<span className="mr-2 text-cyan-400">
											→
										</span>
										<input
											type="text"
											value={realName}
											onChange={(e) =>
												setRealName(e.target.value)
											}
											onKeyDown={handleKeyDown}
											disabled={isLoading}
											className="flex-1 border-none bg-transparent text-white outline-none disabled:text-gray-600"
											autoFocus
											maxLength={64}
											placeholder="John Doe"
										/>
										{!isLoading && showCursor && (
											<span className="ml-1 text-cyan-400">
												█
											</span>
										)}
									</div>
								</div>

								{/* Error message */}
								{error && (
									<div className="mt-4 text-xs text-red-400">
										<span className="mr-2">✗</span>
										{error}
									</div>
								)}

								{/* Instructions */}
								<div className="mt-6 flex items-center justify-between text-xs text-gray-600">
									<div>
										<kbd className="rounded border border-gray-700 bg-[#1a1a1a] px-2 py-1 text-gray-400">
											ESC
										</kbd>{" "}
										<span className="text-gray-500">
											TO GO BACK
										</span>
									</div>
									<div>
										<span className="text-gray-500">
											PRESS
										</span>{" "}
										<kbd className="rounded border border-gray-700 bg-[#1a1a1a] px-2 py-1 text-gray-400">
											ENTER
										</kbd>{" "}
										<span className="text-gray-500">
											TO REGISTER
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Complete */}
					{step === STEP_COMPLETE && (
						<div className="crt-glow animate-fade-in text-center">
							<div className="space-y-4">
								<div className="text-green-400">
									[ AUTHENTICATION SUCCESSFUL ]
								</div>
								<div className="text-xs text-gray-600">
									Loading interface...
								</div>
							</div>
						</div>
					)}

					{/* Footer */}
					{step !== STEP_WELCOME && (
						<div className="mt-4 text-center text-xs text-gray-700">
							<p>PROJECT CLARITY · AUTONOMOUS BUILD</p>
						</div>
					)}
				</div>
			</div>

			{/* CRT Effects */}
			<div className="animate-scanline pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-[rgba(255,255,255,0.02)] to-transparent bg-size-[100%_4px] opacity-20"></div>
			<div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
			<div className="pointer-events-none fixed inset-0 rounded-sm shadow-[inset_0_0_4px_rgba(34,211,238,0.1)]"></div>
		</div>
	);
};

export default Landing;
