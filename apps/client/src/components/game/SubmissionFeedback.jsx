import { useEffect } from "react";
import { useSound } from "../../hooks/useSound";

const SubmissionFeedback = ({ message }) => {
	const { playSound } = useSound();

	// Play sound effects based on message type
	useEffect(() => {
		if (message?.type === "success") {
			playSound("correctAns");
		} else if (message?.type === "error") {
			playSound("wrongAns");
		}
	}, [message, playSound]);

	if (!message) return null;

	return (
		<div className="animate-fade-in my-2 shrink-0">
			<div
				className={`border-l-2 bg-black/50 p-3 text-sm backdrop-blur-sm ${
					message.type === "success"
						? "border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
						: message.type === "story"
							? "border-cyan-500 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
							: "border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
				}`}>
				<div className="flex items-start gap-3">
					<div
						className={`mt-0.5 shrink-0 ${
							message.type === "success"
								? "animate-pulse text-green-500"
								: message.type === "error"
									? "text-red-500"
									: "text-cyan-500"
						}`}>
						{message.type === "success"
							? "✓"
							: message.type === "error"
								? "⚠"
								: "ℹ"}
					</div>
					<div className="flex-1 space-y-1">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-bold tracking-widest opacity-70">
								{message.type === "success"
									? "DECRYPTION_SUCCESS"
									: message.type === "error"
										? "ERROR_LOG"
										: "SYSTEM_MESSAGE"}
							</span>
							<span className="text-[10px] opacity-50">
								{new Date().toLocaleTimeString()}
							</span>
						</div>
						{message.type === "story" ? (
							<div className="space-y-2">
								{message.transmission && (
									<div className="mb-2 text-xs text-gray-500">
										{message.transmission}
									</div>
								)}
								<div className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
									{message.text}
								</div>
							</div>
						) : (
							<div className="font-mono text-xs leading-relaxed">
								{message.text}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubmissionFeedback;
