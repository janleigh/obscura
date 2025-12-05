import { useSound } from "../../hooks/useSound";

const WelcomeScreen = ({ tutorialText, showCursor, typingComplete, onBegin }) => {
	const { playSound } = useSound();

	const handleBegin = () => {
		playSound("buttonPress");
		onBegin();
	};

	return (
		<div className="crt-glow animate-fade-in space-y-8 text-center">
			<div className="space-y-4">
				<div className="text-4xl tracking-wider text-cyan-400">
					OBSCURA
				</div>
				<div className="text-xs text-gray-500">
					LINGUISTIC CALIBRATION INTERFACE v2.19.5
				</div>
			</div>
			<div className="mx-auto max-w-md space-y-4 text-gray-400">
				<div className="border-l-2 border-cyan-400 pl-4 text-left text-xs leading-relaxed">
					{tutorialText}
					{!typingComplete && showCursor && (
						<span className="text-cyan-400">█</span>
					)}
				</div>
			</div>
			<button
				onClick={handleBegin}
				className="pt-8 text-xs text-gray-600 transition-colors hover:text-cyan-400">
				<span className="animate-pulse">
					[ PRESS ANY KEY TO BEGIN ]
				</span>
			</button>
		</div>
	);
};

export default WelcomeScreen;
