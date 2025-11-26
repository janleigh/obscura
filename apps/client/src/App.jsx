import axios from "axios";
import { useEffect, useState } from "react";
import MainGame from "./components/game";
import IntroEmail from "./components/IntroEmail";
import Landing from "./components/landing";
import SignalNoise from "./components/SignalNoise";
import TerminalBoot from "./components/terminal-boot";
import { API_ENDPOINTS } from "./config/api";
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

	// Check for existing session on mount
	useEffect(() => {
		const checkExistingSession = async () => {
			const session = getSession();

			if (session) {
				try {
					// Verify session with backend (resumes session)
					const response = await axios.post(
						API_ENDPOINTS.GAME_START,
						{
							username: session.username
						}
					);

					// Update session with latest data
					const userData = response.data;
					saveSession(userData);
					setUserData(userData);
					setSystemUser(userData.username);
					setStage(STAGE_MAIN);
				} catch (error) {
					console.error("Session validation failed:", error);
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
			<div className="crt-screen fixed inset-0 overflow-hidden bg-[#0a0a0a]">
				{/* Signal Noise Overlay */}
				<SignalNoise
					level={userData?.currentLevel || 1}
					phase={userData?.phaseUnlocked || 1}
				/>
				<div className="font-kode-mono crt-glow relative min-h-screen overflow-y-auto p-8 text-white">
					<div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
						<div>
							<h1 className="mb-2 text-2xl">
								<span className="text-cyan-400">
									LINGUISTIC CALIBRATION INTERFACE
								</span>
								{/* <span className="text-gray-600"> / </span>
								<span className="text-white">
									MAIN WINDOW
								</span> */}
							</h1>
							<p className="text-sm text-gray-500">
								Logged in as:{" "}
								<span className="text-cyan-400">
									{systemUser}
								</span>
							</p>
						</div>
						<button
							onClick={handleLogout}
							className="border border-gray-700 bg-[#1a1a1a] px-4 py-2 text-xs text-gray-400 transition-colors hover:border-red-700 hover:bg-red-950 hover:text-red-400">
							[ EXIT SESSION ]
						</button>
					</div>
					<div className="rounded border border-gray-800 bg-[#0f0f0f]">
						<MainGame
							userData={userData}
							currentLevel={userData?.currentLevel ?? 0}
							onUserDataUpdate={(updatedData) => {
								setUserData(updatedData);
								saveSession(updatedData);
							}}
						/>
					</div>
				</div>
				{/* Scanline effect */}
				<div className="animate-scanline pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-[rgba(255,255,255,0.02)] to-transparent bg-size-[100%_4px] opacity-10"></div>
				{/* CRT screen curvature overlay */}
				<div className="pointer-events-none fixed inset-0 rounded-sm shadow-[inset_0_0_4px_rgba(34,211,238,0.1)]"></div>
			</div>
		);
	}

	return null;
};

export default App;
