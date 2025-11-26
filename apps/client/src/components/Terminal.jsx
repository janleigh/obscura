import { useEffect, useRef, useState } from "react";

const Terminal = ({ onSubmit, isProcessing }) => {
	const [command, setCommand] = useState("");
	const [history, setHistory] = useState([
		{
			type: "system",
			text: "OBSCURA TERMINAL v1.2.0 - Type /help for commands"
		}
	]);
	const historyEndRef = useRef(null);

	// auto-scroll to bottom when history updates
	useEffect(() => {
		historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [history]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && command.trim() && !isProcessing) {
			const cmd = command.trim();
			const newHistory = [...history, { type: "input", text: cmd }];

			// parse commands
			// woah i remember this on my OS project
			// cant believe im doing it again lmao
			if (cmd.startsWith("/submit ")) {
				const answer = cmd.substring(8).trim().toUpperCase();
				if (answer) {
					setHistory([
						...newHistory,
						{
							type: "system",
							text: `Submitting answer: ${answer}...`
						}
					]);
					onSubmit(answer);
				} else {
					setHistory([
						...newHistory,
						{
							type: "error",
							text: "Error: No answer provided. Usage: /submit <answer>"
						}
					]);
				}
			} else if (cmd === "/help") {
				setHistory([
					...newHistory,
					{ type: "output", text: "AVAILABLE COMMANDS:" },
					{
						type: "output",
						text: "  /submit <answer> - Submit your decoded answer"
					},
					{
						type: "output",
						text: "  /help           - Display this help message"
					},
					{
						type: "output",
						text: "  /clear          - Clear terminal history"
					}
					// not implemented; will be revaluated later
					// /logs
					// /shutdown
					// /replay
				]);
			} else if (cmd === "/clear") {
				setHistory([
					{ type: "system", text: "Terminal cleared." }
				]);
			} else if (cmd.startsWith("/")) {
				setHistory([
					...newHistory,
					{
						type: "error",
						text: `Error: Unknown command '${cmd.split(" ")[0]}'. Type /help for available commands.`
					}
				]);
			} else {
				// if not a command, treat as answer submission
				// basically a qol feature
				const answer = cmd.toUpperCase();
				setHistory([
					...newHistory,
					{
						type: "system",
						text: `Submitting answer: ${answer}...`
					}
				]);
				onSubmit(answer);
			}

			setCommand("");
		}
	};

	return (
		<div className="font-kode-mono flex h-full flex-col bg-black">
			{/* History */}
			<div className="scrollbar-thin min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2 text-[12px]">
				{history.map((entry, idx) => (
					<div
						key={idx}
						className={
							entry.type === "input"
								? "text-green-400"
								: entry.type === "error"
									? "text-red-400"
									: entry.type === "system"
										? "text-cyan-400"
										: "text-gray-500"
						}>
						{entry.type === "input" && "> "}
						{entry.text}
					</div>
				))}
				<div ref={historyEndRef} />
			</div>
			{/* Input */}
			<div className="flex shrink-0 items-center gap-2 border-t border-gray-800 bg-[#0a0a0a] p-2">
				<span className="text-xs text-green-400">{">"}</span>
				<input
					type="text"
					value={command}
					onChange={(e) => setCommand(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={isProcessing}
					placeholder="/help"
					className="flex-1 bg-transparent text-xs text-green-400 placeholder-gray-700 outline-none disabled:opacity-50"
					autoFocus
				/>
			</div>
		</div>
	);
};

export default Terminal;
