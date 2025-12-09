import { useEffect } from "react";
import { useSound } from "../../hooks/useSound";

const TerminalHistory = ({ history, historyEndRef, message }) => {
	const { playSound } = useSound();

	// play sound effects based on message type
	useEffect(() => {
		if (message?.type === "success") {
			playSound("correctAns");
		} else if (message?.type === "error") {
			playSound("wrongAns");
		}
	}, [message, playSound]);

	return (
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
					}
				>
					{entry.type === "input" && "> "}
					{entry.text}
				</div>
			))}
			{message && (
				<div
					className={`flex items-start gap-2 border-l-2 pl-2 py-1 ${
						message.type === "success"
							? "border-green-500 text-green-400"
							: message.type === "error"
								? "border-red-500 text-red-400"
								: "border-cyan-500 text-cyan-400"
					}`}
				>
					<span className="shrink-0">
						{message.type === "success"
							? "✓"
							: message.type === "error"
								? "✗"
								: "ℹ"}
					</span>
					<span className="flex-1">{message.text}</span>
				</div>
			)}
			<div ref={historyEndRef} />
		</div>
	);
};

export default TerminalHistory;
