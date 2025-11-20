import axios from "axios";
import { useEffect, useState } from "react";
import Console from "./components/Console";
import IntroEmail from "./components/IntroEmail";
import Landing from "./components/Landing";
import TerminalBoot from "./components/TerminalBoot";
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
			<div className="font-kode-mono fixed inset-0 flex items-center justify-center bg-[#0a0a0a] text-sm text-gray-500">
				<div className="text-center">
					<div className="mb-2 animate-pulse">
						INITIALIZING OBSCURA INTERFACE...
					</div>
					<div className="text-xs text-gray-700">
						v2.19.5 · AUTONOMOUS BUILD
					</div>
				</div>
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
			<div className="font-kode-mono min-h-screen bg-[#0a0a0a] p-8 text-white">
				<div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
					<div>
						<h1 className="mb-2 text-2xl">
							<span className="text-cyan-400">
								LINGUISTIC CALIBRATION INTERFACE
							</span>
							<span className="text-gray-600"> / </span>
							<span className="text-white">MAIN WINDOW</span>
						</h1>
						<p className="text-sm text-gray-500">
							Logged in as:{" "}
							<span className="text-cyan-400">
								{systemUser}
							</span>
							{" · "}
							Level {userData?.currentLevel || 1} · Phase{" "}
							{userData?.phaseUnlocked || 1}
						</p>
					</div>
					<button
						onClick={handleLogout}
						className="border border-gray-700 bg-[#1a1a1a] px-4 py-2 text-xs text-gray-400 transition-colors hover:border-red-700 hover:bg-red-950 hover:text-red-400">
						[ EXIT SESSION ]
					</button>
				</div>
				<div className="rounded border border-gray-800 bg-[#0f0f0f] p-6">
					<p className="mb-4 text-gray-400">
						SYSTEM STATUS:{" "}
						<span className="text-green-400">ONLINE</span>
					</p>
					<p className="text-gray-500">
						<Console 
							userData={userData} 
							currentLevel={userData?.currentLevel || 1}
							onUserDataUpdate={(updatedData) => {
								setUserData(updatedData);
								saveSession(updatedData);
							}}
						/>
					</p>
					<div className="mt-4 space-y-1 text-xs text-gray-600">
						<p>Score: {userData?.score || 0}</p>
						<p>
							Hint Credits: {userData?.hintsRemaining || 0}
						</p>
						<p>
							Completed Levels:{" "}
							{userData?.completedLevels?.length || 0}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default App;
