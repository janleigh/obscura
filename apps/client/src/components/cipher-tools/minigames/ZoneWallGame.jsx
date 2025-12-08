import { useEffect, useRef, useState } from "react";
import { useSound } from "../../../hooks/useSound";
import MiniGameIntro from "./MiniGameIntro";
import MiniGameWrapper from "./MiniGameWrapper";

const TOTAL_LINES = Math.max(
	3,
	Math.min(6, Math.floor(Math.random() * 11))
); // Between 6 and 10 lines
const BAR_WIDTH = 100; // Percentage
const BAR_SPEED = 1.5; // Speed of moving bar (percentage per frame)
const MIN_TARGET_SIZE = 15; // Minimum target size (percentage)
const MAX_TARGET_SIZE = 25; // Maximum target size (percentage)
const MAX_MISSES = Math.max(1, Math.floor(TOTAL_LINES / 2) - 1); // Maximum allowed misses before adding delay
const REQUIRED_HITS = Math.ceil(TOTAL_LINES * 0.7 - 1); // Require at least 70% hits to succeed

const INTRO_MESSAGES = [
	{
		text: "[INIT] ZONEWALL.QTE SYSTEM BOOTING...",
		color: "text-gray-400",
		delay: 500
	},
	{
		text: "[0001] TIMING CALIBRATION ENGINE: ACTIVE",
		color: "text-gray-400",
		delay: 80
	},
	{
		text: "[0002] RED ZONES DETECTED - PRECISION REQUIRED",
		color: "text-red-500",
		delay: 80
	},
	{
		text: `[0003] TARGET ACQUISITION: ${TOTAL_LINES} LINES TO BREACH`,
		color: "text-green-500",
		delay: 80
	},
	{
		text: `[0004] FAILURE THRESHOLD: ${MAX_MISSES} MISSES MAXIMUM`,
		color: "text-yellow-500",
		delay: 80
	},
	{
		text: "[READY] CLICK WHEN BAR ENTERS RED ZONE",
		color: "text-green-500",
		delay: 100
	}
];

const ZoneWallGame = ({ onSuccess, onCancel, onFailure }) => {
	const [showIntro, setShowIntro] = useState(true);
	const [lines, setLines] = useState([]);
	const [currentLine, setCurrentLine] = useState(0);
	const [barPosition, setBarPosition] = useState(0);
	const [isMoving, setIsMoving] = useState(true);
	const [hits, setHits] = useState(0);
	const [misses, setMisses] = useState(0);
	const [isComplete, setIsComplete] = useState(false);
	const [failed, setFailed] = useState(false);
	const { playSound } = useSound();

	const animationRef = useRef(null);

	useEffect(() => {
		if (!showIntro) {
			initializeGame();
		}
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [showIntro]);

	useEffect(() => {
		if (!showIntro && isMoving && currentLine < TOTAL_LINES) {
			animateBar();
		}
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [showIntro, isMoving, currentLine]);

	const initializeGame = () => {
		// Generate lines with random target positions
		const generatedLines = Array(TOTAL_LINES)
			.fill(null)
			.map((_, i) => {
				const targetSize =
					MIN_TARGET_SIZE +
					Math.random() * (MAX_TARGET_SIZE - MIN_TARGET_SIZE);
				const targetStart =
					Math.random() * (BAR_WIDTH - targetSize);
				return {
					id: i,
					targetStart,
					targetEnd: targetStart + targetSize,
					hit: null // null = not attempted, true = hit, false = miss
				};
			});
		setLines(generatedLines);
		setBarPosition(0);
		setIsMoving(true);
	};

	const animateBar = () => {
		setBarPosition((prev) => {
			const next = prev + BAR_SPEED;
			if (next >= BAR_WIDTH) {
				return 0; // Loop back to start
			}
			return next;
		});
		animationRef.current = requestAnimationFrame(animateBar);
	};

	const handleClick = () => {
		if (
			!isMoving ||
			currentLine >= TOTAL_LINES ||
			isComplete ||
			failed
		)
			return;

		const currentLineData = lines[currentLine];
		const isHit =
			barPosition >= currentLineData.targetStart &&
			barPosition <= currentLineData.targetEnd;

		// Update line state
		setLines((prev) =>
			prev.map((line, idx) =>
				idx === currentLine ? { ...line, hit: isHit } : line
			)
		);

		if (isHit) {
			setHits((prev) => prev + 1);
			playSound("buttonPress");
		} else {
			setMisses((prev) => prev + 1);
		}

		// Stop moving and move to next line
		setIsMoving(false);

		setTimeout(() => {
			const nextLine = currentLine + 1;
			if (nextLine >= TOTAL_LINES) {
				// Game complete - check results
				endGame();
			} else {
				setCurrentLine(nextLine);
				setBarPosition(0);
				setIsMoving(true);
			}
		}, 300);
	};

	const endGame = () => {
		const finalHits = hits + (lines[currentLine]?.hit ? 1 : 0);
		const finalMisses =
			misses + (lines[currentLine]?.hit === false ? 1 : 0);

		if (finalHits >= REQUIRED_HITS && finalMisses <= MAX_MISSES) {
			setIsComplete(true);
			playSound("ciphertoolFinish");
		} else {
			setFailed(true);
			if (onFailure) {
				setTimeout(() => onFailure(), 2000);
			}
		}
	};

	const renderLine = (line, idx) => {
		const totalChars = 40;
		const targetStartChar = Math.floor(
			(line.targetStart / 100) * totalChars
		);
		const targetEndChar = Math.floor(
			(line.targetEnd / 100) * totalChars
		);
		const barPositionChar = Math.floor(
			(barPosition / 100) * totalChars
		);

		let lineStr = "[";
		for (let i = 0; i < totalChars; i++) {
			if (i === barPositionChar && idx === currentLine && isMoving) {
				lineStr += "|";
			} else if (i >= targetStartChar && i < targetEndChar) {
				lineStr += "█";
			} else {
				lineStr += "·";
			}
		}
		lineStr += "]";

		return lineStr;
	};

	if (showIntro) {
		return (
			<MiniGameWrapper
				title="ZONEWALL.QTE :: Timing Breach Protocol"
				description=""
				onSuccess={onSuccess}
				onCancel={onCancel}
				isComplete={false}
				hideFooter={true}>
				<MiniGameIntro
					title=":: INITIALIZING ZONEWALL PROTOCOL ::"
					messages={INTRO_MESSAGES}
					onComplete={() => setShowIntro(false)}
				/>
			</MiniGameWrapper>
		);
	}

	return (
		<MiniGameWrapper
			title="ZONEWALL.QTE :: Timing Breach Protocol"
			description={`Click when the bar passes over the red target area. Need ${REQUIRED_HITS} hits out of ${TOTAL_LINES} attempts.`}
			onSuccess={onSuccess}
			onCancel={null}
			isComplete={isComplete}>
			<div className="flex flex-col items-center justify-center gap-6">
				{/* Stats */}
				<div className="flex w-full max-w-3xl justify-between font-mono text-xs">
					<div className="text-green-600">
						LINE:{" "}
						<span className="text-green-400">
							{currentLine + 1}/{TOTAL_LINES}
						</span>
					</div>
					<div className="flex gap-6">
						<div className="text-green-600">
							HITS:{" "}
							<span className="text-green-400">{hits}</span>
						</div>
						<div className="text-red-600">
							MISSES:{" "}
							<span
								className={`${misses >= MAX_MISSES ? "animate-pulse text-red-500" : "text-red-400"}`}>
								{misses}/{MAX_MISSES}
							</span>
						</div>
					</div>
				</div>
				{/* Lines - Terminal Style */}
				<div className="flex w-full max-w-3xl flex-col items-center space-y-3 border-2 border-green-900/50 bg-black/30 p-6 font-mono text-base shadow-[0_0_20px_rgba(34,197,94,0.1)]">
					{lines.map((line, idx) => {
						const isCurrent = idx === currentLine;
						const isHit = line.hit === true;
						const isMiss = line.hit === false;
						const isPending = line.hit === null;

						let lineColor = "text-gray-600";
						let glowClass = "";

						if (isHit) {
							lineColor = "text-green-400";
							glowClass =
								"drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]";
						} else if (isMiss) {
							lineColor = "text-red-400";
							glowClass =
								"drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]";
						} else if (isCurrent) {
							lineColor = "text-green-400";
							glowClass =
								"animate-pulse drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]";
						}

						return (
							<div
								key={line.id}
								className={`flex items-center gap-3 transition-all duration-300 ${isCurrent ? "scale-105" : "scale-100"}`}>
								<span
									className={`${lineColor} ${glowClass} transition-all duration-300`}>
									{renderLine(line, idx)}
								</span>
								{!isPending && (
									<span
										className={`text-lg font-bold ${
											isHit
												? "text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]"
												: "text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
										}`}>
										{isHit ? "✓" : "✗"}
									</span>
								)}
							</div>
						);
					})}
				</div>
				{/* Click button */}
				{!isComplete && !failed && (
					<button
						onClick={handleClick}
						disabled={!isMoving || currentLine >= TOTAL_LINES}
						className="mt-2 border-2 border-green-400 bg-black px-10 py-4 font-mono text-base font-bold text-green-400 transition-all duration-200 hover:scale-105 hover:bg-green-950/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none">
						[ CLICK NOW ]
					</button>
				)}
				{/* Results */}
				{isComplete && (
					<div className="text-center font-mono text-sm text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
						✓ BREACH SUCCESSFUL - {hits} HITS
					</div>
				)}
				{failed && (
					<div className="text-center font-mono text-sm text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
						✗ BREACH FAILED - DECRYPTION DELAYED
					</div>
				)}
			</div>
		</MiniGameWrapper>
	);
};

export default ZoneWallGame;
