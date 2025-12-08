import { useEffect, useState } from "react";
import { useSound } from "../../../hooks/useSound";
import MiniGameIntro from "./MiniGameIntro";
import MiniGameWrapper from "./MiniGameWrapper";

const MIN_SEQUENCE_LENGTH = 2;
const MAX_SEQUENCE_LENGTH = 6;
const DISPLAY_INTERVAL = 800; // ms per character
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const INTRO_MESSAGES = [
	{
		text: "[INIT] MEMD3FR4G3R MATRIX LOADING...",
		color: "text-gray-400",
		delay: 500
	},
	{
		text: "[0001] NEURAL PATTERN RECOGNITION: ENABLED",
		color: "text-gray-400",
		delay: 80
	},
	{
		text: "[0002] SEQUENCE GENERATOR: RANDOMIZING 2-6 CHARS",
		color: "text-green-500",
		delay: 80
	},
	{
		text: "[0003] DISPLAY INTERVAL: 800MS PER CHARACTER",
		color: "text-green-500",
		delay: 80
	},
	{
		text: "[0004] INPUT VALIDATION: STRICT MODE",
		color: "text-yellow-500",
		delay: 80
	},
	{
		text: "[READY] MEMORIZE SEQUENCE - EXACT RECALL REQUIRED",
		color: "text-green-500",
		delay: 100
	}
];

const MemoryGame = ({ onSuccess, onCancel, onFailure }) => {
	const [showIntro, setShowIntro] = useState(true);
	const [sequence, setSequence] = useState([]);
	const [currentDisplay, setCurrentDisplay] = useState("");
	const [isDisplaying, setIsDisplaying] = useState(true);
	const [userInput, setUserInput] = useState([]);
	const [isComplete, setIsComplete] = useState(false);
	const [error, setError] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const [failed, setFailed] = useState(false);
	const { playSound } = useSound();

	useEffect(() => {
		if (!showIntro) {
			initializeGame();
		}
	}, [showIntro]);

	const initializeGame = () => {
		// Generate random sequence with random length
		const sequenceLength =
			MIN_SEQUENCE_LENGTH +
			Math.floor(
				Math.random() *
					(MAX_SEQUENCE_LENGTH - MIN_SEQUENCE_LENGTH + 1)
			);
		const newSequence = [];
		for (let i = 0; i < sequenceLength; i++) {
			const char =
				CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
			newSequence.push(char);
		}
		setSequence(newSequence);

		// Display sequence
		displaySequence(newSequence);
	};

	const displaySequence = async (seq) => {
		setIsDisplaying(true);
		setCurrentDisplay("");

		// Show each character
		for (let i = 0; i < seq.length; i++) {
			await new Promise((resolve) =>
				setTimeout(resolve, DISPLAY_INTERVAL)
			);
			setCurrentDisplay(seq[i]);
			playSound("buttonPress");
		}

		// Clear display after last character
		await new Promise((resolve) =>
			setTimeout(resolve, DISPLAY_INTERVAL)
		);
		setCurrentDisplay("");
		setIsDisplaying(false);
	};

	const handleCharacterClick = (char) => {
		if (isDisplaying || isComplete) return;

		const newInput = [...userInput, char];
		setUserInput(newInput);
		playSound("buttonPress");

		// Check if input matches
		const expectedChar = sequence[userInput.length];
		if (char !== expectedChar) {
			// Wrong character
			const newAttempts = attempts + 1;
			setAttempts(newAttempts);
			setError(true);

			if (newAttempts >= 3) {
				// Failed after 3 attempts
				setFailed(true);
				if (onFailure) {
					setTimeout(() => onFailure(), 2000);
				}
				return;
			}

			setTimeout(() => {
				setError(false);
				setUserInput([]);
			}, 1000);
			return;
		}

		// Check if complete
		if (newInput.length === sequence.length) {
			setIsComplete(true);
			playSound("ciphertoolFinish");
		}
	};

	const getKeypadButtons = () => {
		// Create keypad with all characters
		return CHARACTERS.split("");
	};

	if (showIntro) {
		return (
			<MiniGameWrapper
				title="MEMD3FR4G3R :: Sequential Pattern Recognition"
				description=""
				colors="yellow"
				onSuccess={onSuccess}
				onCancel={onCancel}
				isComplete={false}
				hideFooter={true}>
				<MiniGameIntro
					title=":: INITIALIZING MEMORY PROTOCOL ::"
					messages={INTRO_MESSAGES}
					onComplete={() => setShowIntro(false)}
				/>
			</MiniGameWrapper>
		);
	}

	return (
		<MiniGameWrapper
			title="MEMD3FR4G3R :: Sequential Pattern Recognition"
			description="Memorize the sequence of characters that appear, then input them in the correct order using the keypad below."
			colors="yellow"
			onSuccess={onSuccess}
			onCancel={onCancel}
			isComplete={isComplete}>
			<div className="flex flex-col items-center justify-center gap-6">
				{/* Stats Bar */}
				<div className="flex w-full max-w-2xl justify-between text-xs font-mono">
					<div className="text-yellow-600">
						SEQUENCE: <span className="text-yellow-400">{sequence.length} CHARS</span>
					</div>
					<div className="text-yellow-600">
						ATTEMPTS: <span className={`${attempts >= 2 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>{attempts}/3</span>
					</div>
				</div>
				{/* Display Area */}
				<div className="flex h-20 w-full max-w-2xl items-center justify-center border-2 border-yellow-400/50 bg-black shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all">
					{isDisplaying && currentDisplay && (
						<div className="animate-pulse text-7xl font-bold text-yellow-400 drop-shadow-[0_0_25px_rgba(234,179,8,0.8)]">
							{currentDisplay}
						</div>
					)}
					{isDisplaying && !currentDisplay && (
						<div className="text-sm text-gray-500 animate-pulse">
							[ INITIALIZING SEQUENCE... ]
						</div>
					)}
					{!isDisplaying && !isComplete && (
						<div className="text-sm text-yellow-600 font-mono">
							&gt; INPUT SEQUENCE ({userInput.length}/{sequence.length})
						</div>
					)}
					{isComplete && (
						<div className="text-2xl font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
							✓ SEQUENCE VERIFIED
						</div>
					)}
				</div>
				{/* User Input Display */}
				{!isDisplaying && (
					<div className="flex min-h-14 items-center justify-center gap-3 px-4">
						{userInput.map((char, idx) => (
							<div
								key={idx}
								className={`flex h-12 w-12 items-center justify-center border-2 font-mono text-xl font-bold transition-all duration-200 ${
									error
										? "border-red-400 text-red-400 bg-red-950/20 shadow-[0_0_10px_rgba(248,113,113,0.3)]"
										: "border-yellow-400 text-yellow-400 bg-yellow-950/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
								}`}>
								{char}
							</div>
						))}
						{userInput.length < sequence.length && !error && (
							<div className="h-12 w-12 animate-pulse border-2 border-yellow-600/50 bg-yellow-950/10" />
						)}
					</div>
				)}
				{/* Keypad */}
				{!isDisplaying && !isComplete && (
					<div className="grid grid-cols-9 gap-2">
						{getKeypadButtons().map((char) => (
							<button
								key={char}
								onClick={() => handleCharacterClick(char)}
								disabled={error}
								className={`h-11 w-11 border-2 font-mono text-sm font-bold transition-all duration-150 ${
									error
										? "border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed"
										: "border-yellow-900 bg-black text-yellow-600 hover:border-yellow-400 hover:bg-yellow-950/30 hover:text-yellow-400 hover:scale-105 hover:shadow-[0_0_10px_rgba(234,179,8,0.2)] active:scale-95"
								}`}>
								{char}
							</button>
						))}
					</div>
				)}
				{error && !failed && (
					<div className="text-sm text-red-400 font-mono animate-pulse">
						✗ INCORRECT SEQUENCE - RESETTING
					</div>
				)}
				{failed && (
					<div className="text-sm text-red-400 font-mono">
						✗ MAXIMUM ATTEMPTS EXCEEDED - DECRYPTION DELAYED
					</div>
				)}
			</div>
		</MiniGameWrapper>
	);
};

export default MemoryGame;
