import { useEffect, useRef, useState } from "react";

const MiniGameIntro = ({
	title,
	messages,
	onComplete,
	startDelay = 600
}) => {
	const [displayedLines, setDisplayedLines] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hasStarted, setHasStarted] = useState(false);
	const terminalRef = useRef(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setHasStarted(true);
		}, startDelay);
		return () => clearTimeout(timer);
	}, [startDelay]);

	useEffect(() => {
		if (!hasStarted) return;

		if (currentIndex < messages.length) {
			const currentMessage = messages[currentIndex];
			const timer = setTimeout(() => {
				setDisplayedLines((prev) => [...prev, currentMessage]);
				setCurrentIndex((prev) => prev + 1);
			}, currentMessage.delay);

			return () => clearTimeout(timer);
		} else {
			const completeTimer = setTimeout(() => {
				onComplete();
			}, 500);
			return () => clearTimeout(completeTimer);
		}
	}, [currentIndex, messages, onComplete, hasStarted]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: only depends on displayedLines
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop =
				terminalRef.current.scrollHeight;
		}
	}, [displayedLines]);

	return (
		<div className="flex h-full flex-col bg-black p-4 font-mono text-sm">
			<div className="mb-4 border-b border-green-500/30 pb-2">
				<div className="text-green-500">{title}</div>
			</div>
			<div
				ref={terminalRef}
				className="flex-1 space-y-1 overflow-y-auto"
			>
				{displayedLines.map((line, index) => (
					<div key={index} className={line.color}>
						{line.text}
					</div>
				))}
				{currentIndex < messages.length && (
					<span className="animate-pulse text-white">█</span>
				)}
			</div>
		</div>
	);
};

export default MiniGameIntro;
