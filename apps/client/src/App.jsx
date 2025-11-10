import { useEffect, useState } from "react";
import Console from "./components/Console";
import IntroEmail from "./components/IntroEmail";
import Landing from "./components/Landing";
import TerminalBoot from "./components/TerminalBoot";

// Flow stages
const STAGE_LANDING = "landing";
const STAGE_EMAIL = "email";
const STAGE_BOOT = "boot";
const STAGE_MAIN = "main";

const App = () => {
	const [stage, setStage] = useState(STAGE_LANDING);
	const [userData, setUserData] = useState(null);
	const [systemUser, setSystemUser] = useState(null);

	// Handle ESC key for skipping email
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "Escape" && stage === STAGE_EMAIL) {
				setStage(STAGE_BOOT);
			}
			if (e.key === "Enter" && stage === STAGE_EMAIL) {
				// Check if email is complete by checking if continue button should be visible
				// For now, we'll let the button handle it
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
				<div className="mb-6 border-b border-gray-800 pb-4">
					<h1 className="mb-2 text-2xl">
						<span className="text-cyan-400">
							LINGUISTIC CALIBRATION INTERFACE
						</span>
						<span className="text-gray-600"> / </span>
						<span className="text-white">MAIN WINDOW</span>
					</h1>
					<p className="text-sm text-gray-500">
						Logged in as:{" "}
						<span className="text-cyan-400">{systemUser}</span>
					</p>
				</div>
				<div className="rounded border border-gray-800 bg-[#0f0f0f] p-6">
					<p className="mb-4 text-gray-400">
						SYSTEM STATUS:{" "}
						<span className="text-green-400">ONLINE</span>
					</p>
					<p className="text-gray-500">
						<Console />
					</p>
				</div>
			</div>
		);
	}

	return null;
};

export default App;
