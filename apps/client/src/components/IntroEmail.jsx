import { useEffect, useState } from "react";
import { useSound } from "../hooks/useSound";

const IntroEmail = ({ userData, onComplete, onSkip }) => {
	const [showEmail, setShowEmail] = useState(false);
	const [typedLines, setTypedLines] = useState([]);
	const [currentLineIndex, setCurrentLineIndex] = useState(0);
	const [showSkipButton, setShowSkipButton] = useState(false);
	const { playSound } = useSound();

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
			text: "Begin Tutorial: Calibration 00.",
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
		playSound("buttonPress");
		onComplete();
	};

	const handleSkip = () => {
		playSound("buttonPress");
		onSkip();
	};

	const isComplete = currentLineIndex >= emailContent.length;

	return (
		<div className="font-kode-mono fixed inset-0 bg-[#050505] text-sm">
			<div className="flex h-full flex-col p-4 md:p-8">
				{/* Terminal Window */}
				<div className="flex flex-1 flex-col overflow-hidden rounded border border-gray-800 bg-[#0a0a0a] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-gray-800 bg-[#0f0f0f] px-4 py-2">
						<div className="flex items-center gap-2">
							<div className="h-3 w-3 rounded-full bg-red-500/20"></div>
							<div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
							<div className="h-3 w-3 rounded-full bg-green-500/20"></div>
							<span className="ml-2 text-xs text-gray-500">MAIL_CLIENT_V1.0</span>
						</div>
						<div className="text-xs text-gray-600">
							{isComplete ? (
								<span className="text-green-400 animate-pulse">
									● CONNECTED
								</span>
							) : (
								<span className="animate-pulse text-yellow-500">
									○ RECEIVING DATA...
								</span>
							)}
						</div>
					</div>

					{/* Email Metadata Grid */}
					<div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-b border-gray-800 bg-[#0c0c0c] p-6 text-xs">
						<div className="text-gray-500">FROM:</div>
						<div className="text-cyan-400">recruitment@obscuracollective.org</div>
						
						<div className="text-gray-500">TO:</div>
						<div className="text-gray-300">{userData.realName} <span className="text-gray-600">&lt;{userData.username}@candidate.obscura.net&gt;</span></div>
						
						<div className="text-gray-500">DATE:</div>
						<div className="text-gray-400">{realTimeDate}</div>
						
						<div className="text-gray-500">SUBJECT:</div>
						<div className="font-bold text-white tracking-wide">YOU'VE BEEN SELECTED</div>
					</div>

					{/* Email content */}
					<div className="scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-800 flex-1 overflow-y-auto p-8 font-mono">
						<div className="mx-auto max-w-3xl">
							{showEmail && (
								<div className="space-y-1 text-gray-300 leading-relaxed">
									{typedLines.map((line, index) => {
										// Skip metadata lines in body since we show them in header
										if (line.startsWith("From:") || line.startsWith("To:") || line.startsWith("Date:") || line.startsWith("Subject:")) return null;
										
										return (
											<div
												key={index}
												className={
													line.startsWith("─") 
														? "text-gray-700 my-4"
														: line.includes("Congratulations")
															? "text-xl text-cyan-400 font-bold mb-4"
															: line.includes("Begin Tutorial")
																? "text-green-400 font-bold mt-4"
																: ""
												}>
												{line || "\u00A0"}
											</div>
										);
									})}
									{!isComplete && (
										<span className="animate-pulse text-cyan-400">
											_
										</span>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Footer actions */}
					<div className="border-t border-gray-800 bg-[#0f0f0f] p-4">
						<div className="flex items-center justify-between">
							<div className="text-xs text-gray-600 font-mono">
								{isComplete ? (
									<span>[ END OF MESSAGE ]</span>
								) : (
									<span>
										PACKETS RECEIVED: {currentLineIndex}/{emailContent.length}
									</span>
								)}
							</div>
							<div className="flex gap-4">
								{showSkipButton && (
									<button
										onClick={handleSkip}
										disabled={isComplete}
										className={`group border border-gray-800 bg-transparent px-4 py-2 text-xs text-gray-500 transition-colors hover:border-gray-600 hover:text-gray-300${isComplete ? " cursor-not-allowed opacity-20" : ""}`}>
										SKIP_ANIMATION <span className="ml-2 rounded bg-gray-800 px-1 text-[10px] group-hover:bg-gray-700">ESC</span>
									</button>
								)}
								{isComplete && (
									<button
										onClick={handleContinue}
										className="group border border-cyan-700 bg-cyan-950/30 px-6 py-2 text-xs font-bold text-cyan-400 transition-all hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
										INITIALIZE_SYSTEM <span className="ml-2 text-cyan-600 group-hover:text-cyan-300">⏎</span>
									</button>
								)}
							</div>
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
