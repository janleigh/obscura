import { useEffect, useRef, useState } from "react";
import MainGame from "./components/game";
import IntroEmail from "./components/IntroEmail";
import Landing from "./components/landing";
import SignalNoise from "./components/SignalNoise";
import TerminalBoot from "./components/terminal-boot";
import { useSound } from "./hooks/useSound";
import { clearSession, getSession, saveSession } from "./utils/session";

// Flow
// Landing -> request to backend to create user -> IntroEmail -> TerminalBoot -> Main
const STAGE_LANDING = "landing";
const STAGE_EMAIL = "email";
const STAGE_BOOT = "boot";
const STAGE_MAIN = "main";

const App = () => {
	const [stage, setStage] = useState(STAGE_LANDING);
	const [userData, setUserData] = useState(null);
	const [systemUser, setSystemUser] = useState(null);
	const [isCheckingSession, setIsCheckingSession] = useState(true);
	const { playSound, stopSound } = useSound();
	const loginMusicStartedRef = useRef(false);

	// Check for existing session on mount
	useEffect(() => {
		const checkExistingSession = async () => {
			const session = getSession();

			if (session && session.authToken) {
				try {
					// Use stored session data directly without backend validation
					// Backend validation happens on actual API calls
					const userData = {
						userId: session.userId,
						username: session.username,
						realName: session.realName,
						currentLevel: session.lastLevel,
						phaseUnlocked: session.phase,
						completedLevels: []
					};
					
					setUserData(userData);
					setSystemUser(userData.username);
					setStage(STAGE_MAIN);
				} catch (error) {
					console.error("Session restore failed:", error);
					clearSession();
				}
			}

			setIsCheckingSession(false);
		};

		checkExistingSession();
	}, []);

	// Handle ESC key for skipping email
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "Escape" && stage === STAGE_EMAIL) {
				setStage(STAGE_BOOT);
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [stage]);

	// Play login music during login stages and terminal music during game
	useEffect(() => {
		if (isCheckingSession) return; // Don't play music while checking session

		if (stage === STAGE_MAIN) {
			// Stop login music and start terminal music
			stopSound("loginMusic");
			loginMusicStartedRef.current = false;
			playSound("terminalMusic", { volume: 0.5, loop: true });
		} else if (
			stage === STAGE_LANDING ||
			stage === STAGE_EMAIL ||
			stage === STAGE_BOOT
		) {
			// Play login music only once during entire login phase
			if (!loginMusicStartedRef.current) {
				stopSound("terminalMusic");
				playSound("loginMusic", { volume: 0.5, loop: true });
				loginMusicStartedRef.current = true;
			}
		}
	}, [stage, isCheckingSession, playSound, stopSound]);

	const handleLandingComplete = (data) => {
		setUserData(data);
		setStage(STAGE_EMAIL);
	};

	const handleEmailComplete = () => {
		setStage(STAGE_BOOT);
	};

	const handleEmailSkip = () => {
		setStage(STAGE_BOOT);
	};

	const handleBootComplete = (username) => {
		setSystemUser(username);
		setStage(STAGE_MAIN);
	};

	const handleLogout = () => {
		clearSession();
		setUserData(null);
		setSystemUser(null);
		setStage(STAGE_LANDING);
		loginMusicStartedRef.current = false;
	};

	// Show loading screen while checking for existing session
	if (isCheckingSession) {
		return (
			<div className="font-kode-mono crt-screen fixed inset-0 flex items-center justify-center bg-[#0a0a0a] text-sm text-gray-500">
				<div className="crt-glow text-center">
					<div className="mb-2 animate-pulse text-cyan-400">
						INITIALIZING OBSCURA INTERFACE...
					</div>
					<div className="text-xs text-gray-700">
						v2.19.5 · AUTONOMOUS BUILD
					</div>
				</div>
				{/* Scanline effect */}
				<div className="animate-scanline pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-[rgba(255,255,255,0.02)] to-transparent bg-size-[100%_4px] opacity-20"></div>
			</div>
		);
	}

	// Render current stage
	if (stage === STAGE_LANDING) {
		return <Landing onComplete={handleLandingComplete} />;
	}

	if (stage === STAGE_EMAIL) {
		return (
			<IntroEmail
				userData={userData}
				onComplete={handleEmailComplete}
				onSkip={handleEmailSkip}
			/>
		);
	}

	if (stage === STAGE_BOOT) {
		return (
			<TerminalBoot
				userData={userData}
				onBootComplete={handleBootComplete}
			/>
		);
	}

	if (stage === STAGE_MAIN) {
		return (
			<div className="crt-screen fixed inset-0 overflow-hidden bg-[#050505]">
				{/* Signal Noise Overlay */}
				<SignalNoise
					level={userData?.currentLevel || 1}
					phase={userData?.phaseUnlocked || 1}
				/>
				{/* Main Layout Grid */}
				<div className="font-kode-mono crt-glow relative flex h-full w-full flex-col p-4 text-white md:p-8">
					{/* Top Bar */}
					<div className="mb-6 flex shrink-0 items-end justify-between border-b-2 border-gray-800 bg-[#0a0a0a]/80 pb-4 backdrop-blur-sm">
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-3">
								<div className="h-3 w-3 animate-pulse bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
								<h1 className="text-2xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
									OBSCURA
								</h1>
							</div>
							<div className="flex items-center gap-2 text-[10px] text-gray-500">
								<span>LINGUISTIC CALIBRATION INTERFACE</span>
								<span className="text-gray-700">|</span>
								<span className="text-cyan-700">v2.19.5</span>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="hidden text-right text-[10px] text-gray-500 sm:block">
								<div>USER: <span className="text-cyan-600">{systemUser}</span></div>
								<div>SESSION_ID: <span className="text-gray-600">{Math.random().toString(36).substr(2, 8).toUpperCase()}</span></div>
							</div>
							<button
								onClick={() => {
									playSound("buttonPress");
									handleLogout();
								}}
								className="group relative border border-red-900/50 bg-red-950/10 px-4 py-2 text-xs text-red-400 transition-all hover:border-red-500 hover:bg-red-950/30 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]">
								<span className="relative z-10">[ TERMINATE SESSION ]</span>
								<div className="absolute inset-0 z-0 bg-red-900/0 transition-colors group-hover:bg-red-900/10"></div>
							</button>
						</div>
					</div>
					{/* Main Content Area */}
					<div className="relative flex-1 overflow-hidden rounded-lg border border-gray-800 bg-[#0f0f0f] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
						{/* Corner Accents */}
						<div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-500/50"></div>
						<div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-500/50"></div>
						<div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-500/50"></div>
						<div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-500/50"></div>
						
						<MainGame
							userData={userData}
							currentLevel={userData?.currentLevel ?? 0}
							onUserDataUpdate={(updatedData) => {
								setUserData(updatedData);
								saveSession(updatedData);
							}}
						/>
					</div>
					{/* Footer Status Bar */}
					<div className="mt-2 flex shrink-0 justify-between text-[10px] text-gray-600">
						<div className="flex gap-4">
							<span>NET: <span className="text-green-600">CONNECTED</span></span>
							<span>ENCRYPTION: <span className="text-green-600">AES-256</span></span>
						</div>
						<div className="animate-pulse text-cyan-900">
							AWAITING INPUT...
						</div>
					</div>
				</div>
				{/* Scanline effect */}
				<div className="animate-scanline pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-[rgba(255,255,255,0.02)] to-transparent bg-size-[100%_4px] opacity-10"></div>
				{/* CRT screen curvature overlay */}
				<div className="pointer-events-none fixed inset-0 rounded-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>
			</div>
		);
	}

	return null;
};

export default App;
