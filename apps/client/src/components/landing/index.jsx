import { useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useCursorBlink } from "../../hooks/useCursorBlink";
import { useSound } from "../../hooks/useSound";
import { useTypingEffect } from "../../hooks/useTypingEffect";
import CRTEffects from "../shared/CRTEffects";
import AboutScreen from "./AboutScreen";
import CompleteScreen from "./CompleteScreen";
import LoadingScreen from "./LoadingScreen";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import WelcomeScreen from "./WelcomeScreen";

const STEP_WELCOME = 0;
const STEP_LOGIN = 1;
const STEP_REGISTER = 2;
const STEP_LOADING = 3;
const STEP_COMPLETE = 4;
const STEP_ABOUT = 5;

const TUTORIAL_MESSAGES = {
	[STEP_WELCOME]:
		"SYSTEM READY. AWAITING INPUT. PRESS ANY KEY TO INITIALIZE CALIBRATION SEQUENCE...",
	[STEP_LOGIN]: "SECURE GATEWAY REACHED. ENTER CREDENTIALS TO PROCEED.",
	[STEP_REGISTER]:
		"NEW CANDIDATE DETECTED. CREATE PROFILE TO ACCESS NETWORK.",
	[STEP_ABOUT]: "ACCESSING DEVELOPER ARCHIVES..."
};

const Landing = ({ onComplete }) => {
	const [step, setStep] = useState(STEP_WELCOME);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [realName, setRealName] = useState("");

	const showCursor = useCursorBlink(500);
	const { isLoading, error, setError, login, register } =
		useAuthentication();
	const { playSound } = useSound();
	const { displayedText: tutorialText, isComplete: typingComplete } =
		useTypingEffect(TUTORIAL_MESSAGES[step] || "", 30, true);

	const handleLoginSubmit = async () => {
		if (!username.trim() || !password) return;

		setStep(STEP_LOADING);
		const result = await login(username, password);

		if (result?.success) {
			setStep(STEP_COMPLETE);
			setTimeout(() => onComplete(result.userData), 2000);
		} else if (result?.error) {
			setStep(STEP_LOGIN);
			setPassword(""); // Clear password on error
		}
	};

	const handleRegistrationSubmit = async () => {
		if (!username.trim() || !realName.trim() || !password)
			return;

		if (password.length < 8) {
			setError("PASSWORD_TOO_SHORT_MIN_8_CHARS");
			return;
		}

		setStep(STEP_LOADING);
		const result = await register(username, realName, password);

		if (result?.success) {
			setStep(STEP_COMPLETE);
			setTimeout(() => onComplete(result.userData), 2000);
		} else if (result?.error) {
			setStep(STEP_REGISTER);
		}
	};

	const handleKeyDown = (e) => {
		if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;

		if (step === STEP_WELCOME && e.key) {
			playSound("buttonPress");
			setStep(STEP_LOGIN);
		}
	};

	const handleBeginCalibration = () => {
		playSound("buttonPress");
		setStep(STEP_LOGIN);
	};

	const handleSwitchToRegister = () => {
		playSound("buttonPress");
		setStep(STEP_REGISTER);
		setPassword("");
		setError(null);
	};

	const handleSwitchToLogin = () => {
		playSound("buttonPress");
		setStep(STEP_LOGIN);
		setRealName("");
		setPassword("");
		setError(null);
	};

	const handleShowAbout = () => {
		playSound("buttonPress");
		setStep(STEP_ABOUT);
	};

	const handleBackToWelcome = () => {
		playSound("buttonPress");
		setStep(STEP_WELCOME);
	};

	return (
		<div
			className="font-kode-mono crt-screen fixed inset-0 bg-[#050505] text-sm"
			onKeyDown={handleKeyDown}
			tabIndex={0}>
			{/* Background Grid */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
			<div className="relative z-10 flex min-h-screen w-full items-center justify-center p-8">
				<div className="flex w-full max-w-2xl flex-col items-center">
					{step === STEP_WELCOME && (
						<WelcomeScreen
							tutorialText={tutorialText}
							showCursor={showCursor}
							typingComplete={typingComplete}
							onBegin={handleBeginCalibration}
							onShowAbout={handleShowAbout}
							gitHash={import.meta.env.VITE_GIT_COMMIT_HASH}
						/>
					)}
					{step === STEP_LOGIN && (
						<LoginForm
							username={username}
							password={password}
							onUsernameChange={setUsername}
							onPasswordChange={setPassword}
							onSubmit={handleLoginSubmit}
							onRegisterInstead={handleSwitchToRegister}
							isLoading={isLoading}
							error={error}
							tutorialText={tutorialText}
							showCursor={showCursor}
							typingComplete={typingComplete}
						/>
					)}
					{step === STEP_REGISTER && (
						<RegistrationForm
							username={username}
							realName={realName}
							password={password}
							onUsernameChange={setUsername}
							onRealNameChange={setRealName}
							onPasswordChange={setPassword}
							onSubmit={handleRegistrationSubmit}
							onBack={handleSwitchToLogin}
							isLoading={isLoading}
							error={error}
							tutorialText={tutorialText}
							showCursor={showCursor}
							typingComplete={typingComplete}
						/>
					)}
					{step === STEP_LOADING && <LoadingScreen />}
					{step === STEP_COMPLETE && <CompleteScreen />}
					{step === STEP_ABOUT && <AboutScreen onBack={handleBackToWelcome} />}
					{step !== STEP_WELCOME && step !== STEP_ABOUT && (
						<div className="mt-8 flex justify-center gap-8 text-[10px] text-gray-800">
							<span>SECURE_CONNECTION_ESTABLISHED</span>
							<span>ENCRYPTION: AES-256-GCM</span>
							<span>SERVER: OBSCURA-NODE-01</span>
						</div>
					)}
				</div>
			</div>

			<CRTEffects />
		</div>
	);
};

export default Landing;
