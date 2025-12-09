import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/api";
import { useSound } from "../../hooks/useSound";
import Button from "../shared/Button";

const WelcomeScreen = ({
	tutorialText,
	showCursor,
	typingComplete,
	onShowAbout,
	onBegin,
	gitHash
}) => {
	const [hash, setHash] = useState("");
	useSound();

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
		fetch(API_ENDPOINTS.HASH)
			.then((res) => res.json())
			.then((data) => {
				if (data.gitHash) {
					setHash(data.gitHash);
				}
			})
			.catch((err) => {
				console.error("Error fetching git hash:", err);
			});
	}, [gitHash]);

	return (
		<div className="crt-glow animate-fade-in space-y-12 text-center">
			<div className="relative space-y-4">
				<div className="absolute -inset-4 -z-10 bg-cyan-500/5 blur-3xl"></div>
				<div className="text-6xl md:text-7xl 2xl:text-8xl font-bold tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300">
					OBSCURA
				</div>
				<div className="flex justify-center gap-4 text-xs md:text-sm 2xl:text-base tracking-widest text-gray-500">
					<span>SYSTEM_READY</span>
					<span>::</span>
					<span>
						{hash
							? `BUILD_${hash.substring(0, 7)}`
							: "BUILD_UNKNOWN"}
					</span>
				</div>
			</div>
			<div className="mx-auto max-w-md md:max-w-lg 2xl:max-w-xl border-l-2 border-cyan-900/50 bg-linear-to-r from-cyan-950/10 to-transparent p-6 text-left transition-all duration-300">
				<div className="mb-2 text-[10px] md:text-xs 2xl:text-sm text-cyan-700">
					SYSTEM MESSAGE:
				</div>
				<div className="text-sm md:text-base 2xl:text-lg leading-relaxed text-gray-300">
					{tutorialText}
					{!typingComplete && showCursor && (
						<span className="animate-pulse text-cyan-400">
							_
						</span>
					)}
				</div>
			</div>
			<div className="flex justify-center pt-8">
				<Button
					onClick={onBegin}
					className="px-8 py-3 text-lg tracking-widest animate-pulse hover:animate-none"
				>
					[ INITIALIZE_SYSTEM ]
				</Button>
			</div>
			<div className="flex justify-center pt-8">
				<Button
					onClick={handleAbout}
					variant="secondary"
					className="px-4 py-2 text-xs opacity-50 transition-opacity hover:opacity-100"
				>
					SYSTEM ARCHITECTS
				</Button>
			</div>
		</div>
	);
};

export default WelcomeScreen;
