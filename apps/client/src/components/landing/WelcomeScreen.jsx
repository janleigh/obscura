import { useEffect, useState } from "react";
import { useSound } from "../../hooks/useSound";
import Button from "../shared/Button";

const WelcomeScreen = ({
	tutorialText,
	showCursor,
	typingComplete,
	onBegin,
	onShowAbout,
	gitHash
}) => {
	const [hash, setHash] = useState("");
	const { playSound } = useSound();

	const handleBegin = () => {
		playSound("buttonPress");
		onBegin();
	};

	const handleAbout = (e) => {
		e.stopPropagation();
		onShowAbout();
	};

	useEffect(() => {
		if (gitHash) {
			setHash(gitHash);
			return;
		}
		// fetch from http://localhost:3000/hash
		fetch("http://localhost:3000/hash")
			.then((res) => res.json())
			.then((data) => {
				if (data.gitHash) {
					setHash(data.gitHash);
				}
			})
			.catch((err) => {
				console.error("Error fetching git hash:", err);
			});
	}, [gitHash])
	

	return (
		<div className="crt-glow animate-fade-in space-y-12 text-center">
			<div className="relative space-y-4">
				<div className="absolute -inset-4 -z-10 bg-cyan-500/5 blur-3xl"></div>
				<div className="text-6xl font-bold tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
					OBSCURA
				</div>
				<div className="flex justify-center gap-4 text-xs tracking-widest text-gray-500">
					<span>SYSTEM_READY</span>
					<span>::</span>
					<span>{hash ? `BUILD_${hash.substring(0,7)}` : "BUILD_UNKNOWN"}</span>
				</div>
			</div>
			<div className="mx-auto max-w-md border-l-2 border-cyan-900/50 bg-linear-to-r from-cyan-950/10 to-transparent p-6 text-left">
				<div className="mb-2 text-[10px] text-cyan-700">SYSTEM MESSAGE:</div>
				<div className="text-sm leading-relaxed text-gray-300">
					{tutorialText}
					{!typingComplete && showCursor && (
						<span className="animate-pulse text-cyan-400">_</span>
					)}
				</div>
			</div>
			<div className="flex justify-center pt-8">
				<Button 
					onClick={handleAbout} 
					variant="secondary" 
					className="text-xs px-4 py-2 opacity-50 hover:opacity-100 transition-opacity"
				>
					SYSTEM ARCHITECTS
				</Button>
			</div>
		</div>
	);
};

export default WelcomeScreen;
