import { useEffect, useState } from "react";

const IntroEmail = ({ userData, onComplete, onSkip }) => {
	const [showEmail, setShowEmail] = useState(false);
	const [typedLines, setTypedLines] = useState([]);
	const [currentLineIndex, setCurrentLineIndex] = useState(0);
	const [showSkipButton, setShowSkipButton] = useState(false);

	const realTimeDate = new Date().toLocaleDateString();
	const emailContent = [
		{
			text: "From: recruitment@obscuracollective.org",
			delay: 30
		},
		{
			text: `To: ${userData.realName} <${userData.username}@candidate.obscura.net>`,
			delay: 30
		},
		{ text: `Date: ${realTimeDate}`, delay: 30 },
		{ text: "Subject: You've Been Selected", delay: 40 },
		{ text: "", delay: 20 },
		{ text: "─".repeat(70), delay: 10 },
		{ text: "", delay: 20 },
		{ text: `Congratulations.`, delay: 50 },
		{ text: "", delay: 20 },
		{
			text: "Your linguistic aptitude profile has been flagged for Project Clarity—a global initiative",
			delay: 35
		},
		{
			text: "to train next-generation AI translation models.",
			delay: 35
		},
		{ text: "", delay: 20 },
		{
			text: "You will decrypt historical communication samples. Your performance will be evaluated.",
			delay: 35
		},
		{
			text: "Compensation is merit-based.",
			delay: 35
		},
		{ text: "", delay: 20 },
		{
			text: "Begin Calibration Module 01.",
			delay: 50
		},
		{ text: "", delay: 20 },
		{ text: "—", delay: 30 },
		{ text: "The Obscura Collective", delay: 50 },
		{ text: "Cryptolinguistics Division", delay: 50 },
		{ text: "", delay: 20 }
	];

	// Show email after a brief delay
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowEmail(true);
			setShowSkipButton(true);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!showEmail || currentLineIndex >= emailContent.length) {
			return;
		}

		const currentLine = emailContent[currentLineIndex];
		const timer = setTimeout(() => {
			setTypedLines((prev) => [...prev, currentLine.text]);
			setCurrentLineIndex((prev) => prev + 1);
		}, currentLine.delay);

		return () => clearTimeout(timer);
	}, [showEmail, currentLineIndex, emailContent.length]);

	const handleContinue = () => {
		onComplete();
	};

	const handleSkip = () => {
		onSkip();
	};

	const isComplete = currentLineIndex >= emailContent.length;

	return (
		<div className="font-kode-mono fixed inset-0 bg-[#0a0a0a] text-sm">
			<div className="flex h-full flex-col">
				{/* Header */}
				<div className="border-b border-gray-800 bg-[#0f0f0f] p-4">
					<div className="flex items-center justify-between">
						<div>
							<span className="text-cyan-400">MAIL</span>
							<span className="text-gray-600"> / </span>
							<span className="text-white">INBOX</span>
						</div>
						<div className="text-xs text-gray-600">
							{isComplete ? (
								<span className="text-green-400">
									[ LOADED ]
								</span>
							) : (
								<span className="animate-pulse text-yellow-300">
									[ RECEIVING... ]
								</span>
							)}
						</div>
					</div>
				</div>
				{/* Email content */}
				<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800 flex-1 overflow-y-auto p-6">
					<div className="mx-auto max-w-4xl">
						{showEmail && (
							<div className="space-y-1 text-gray-300">
								{typedLines.map((line, index) => (
									<div
										key={index}
										className={
											line.startsWith("From:") ||
											line.startsWith("To:") ||
											line.startsWith("Date:") ||
											line.startsWith("Subject:")
												? "text-white"
												: line.startsWith(
															"Dear"
													  ) ||
													  line.startsWith(
															"Best regards"
													  ) ||
													  line.startsWith(
															"Dr."
													  ) ||
													  line.startsWith(
															"Lead Researcher"
													  ) ||
													  line.startsWith(
															"Cryptolinguistics"
													  )
													? "text-gray-400"
													: line.includes(
																"ATTACHMENT"
														  )
														? "text-cyan-400"
														: ""
										}>
										{line || "\u00A0"}
									</div>
								))}
								{!isComplete && (
									<span className="animate-pulse text-cyan-400">
										█
									</span>
								)}
							</div>
						)}
					</div>
				</div>
				{/* Footer actions */}
				<div className="border-t border-gray-800 bg-[#0f0f0f] p-4">
					<div className="flex items-center justify-between">
						<div className="text-xs text-gray-600">
							{isComplete ? (
								<span>END OF MESSAGE</span>
							) : (
								<span>
									RECEIVING MESSAGE... {currentLineIndex}
									/{emailContent.length}
								</span>
							)}
						</div>
						<div className="flex gap-4">
							{showSkipButton && (
								<button
									onClick={handleSkip}
									disabled={isComplete}
									className={`border border-gray-700 bg-[#1a1a1a] px-4 py-2 text-xs text-gray-400 transition-colors hover:border-gray-600 hover:bg-[#202020] hover:text-gray-300${isComplete ? " cursor-not-allowed opacity-50" : ""}`}>
									[ SKIP ]{" "}
									<span className="text-gray-600">
										ESC
									</span>
								</button>
							)}
							{isComplete && (
								<button
									onClick={handleContinue}
									className="border border-cyan-700 bg-cyan-950 px-4 py-2 text-xs text-cyan-400 transition-colors hover:bg-cyan-900">
									[ CONTINUE TO SYSTEM ]{" "}
									<span className="text-cyan-600">
										ENTER
									</span>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Scanline effect */}
			<div className="animate-scanline pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-[rgba(255,255,255,0.02)] to-transparent bg-size-[100%_4px] opacity-20"></div>
			{/* Vignette effect */}
			<div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
		</div>
	);
};

export default IntroEmail;
