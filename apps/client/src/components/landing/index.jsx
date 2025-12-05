import { useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useCursorBlink } from "../../hooks/useCursorBlink";
import { useSound } from "../../hooks/useSound";
import { useTypingEffect } from "../../hooks/useTypingEffect";
import CRTEffects from "../shared/CRTEffects";
import CompleteScreen from "./CompleteScreen";
import LoadingScreen from "./LoadingScreen";
import RegistrationForm from "./RegistrationForm";
import UsernameInput from "./UsernameInput";
import WelcomeScreen from "./WelcomeScreen";

const STEP_WELCOME = 0;
const STEP_USERNAME = 1;
const STEP_LOADING = 2;
const STEP_NEW_USER = 3;
const STEP_COMPLETE = 4;

const TUTORIAL_MESSAGES = {
	[STEP_WELCOME]:
		"Welcome to OBSCURA. Press any key to begin linguistic calibration...",
	[STEP_USERNAME]: "Enter your system identifier to access the network.",
	[STEP_NEW_USER]:
		"New candidate detected. Please provide your designation for records."
};

const Landing = ({ onComplete }) => {
	const [step, setStep] = useState(STEP_WELCOME);
	const [username, setUsername] = useState("");
	const [realName, setRealName] = useState("");

	const showCursor = useCursorBlink(500);
	const { isLoading, error, setError, login, register } =
		useAuthentication();
	const { playSound } = useSound();
	const { displayedText: tutorialText, isComplete: typingComplete } =
		useTypingEffect(TUTORIAL_MESSAGES[step] || "", 30, true);

	const handleUsernameSubmit = async () => {
		if (!username.trim()) return;

		setStep(STEP_LOADING);
		const result = await login(username);

		if (result?.needsRegistration) {
			setStep(STEP_NEW_USER);
		} else if (result?.success) {
			setStep(STEP_COMPLETE);
			setTimeout(() => onComplete(result.userData), 1000);
		} else if (result?.error) {
			setStep(STEP_USERNAME);
		}
	};

	const handleRegistration = async () => {
		if (!realName.trim()) return;

		const result = await register(username, realName);

		if (result?.success) {
			setStep(STEP_COMPLETE);
			setTimeout(() => onComplete(result.userData), 1000);
		}
	};

	const handleKeyDown = (e) => {
		if (step === STEP_WELCOME && e.key) {
			playSound("buttonPress");
			setStep(STEP_USERNAME);
		}
	};

	const handleBeginCalibration = () => {
		playSound("buttonPress");
		setStep(STEP_USERNAME);
	};

	const handleBackToUsername = () => {
		setStep(STEP_USERNAME);
		setRealName("");
		setError(null);
	};

	return (
		<div
			className="font-kode-mono crt-screen fixed inset-0 bg-[#0a0a0a] text-sm"
			onKeyDown={handleKeyDown}
			tabIndex={0}>
			<div className="flex min-h-screen w-full items-center justify-center p-8">
				<div className="w-full max-w-2xl">
					{step === STEP_WELCOME && (
						<WelcomeScreen
							tutorialText={tutorialText}
							showCursor={showCursor}
							typingComplete={typingComplete}
							onBegin={handleBeginCalibration}
						/>
					)}
					{step === STEP_USERNAME && (
						<UsernameInput
							username={username}
							onChange={setUsername}
							onSubmit={handleUsernameSubmit}
							isLoading={isLoading}
							tutorialText={tutorialText}
							showCursor={showCursor}
							typingComplete={typingComplete}
						/>
					)}
					{step === STEP_LOADING && <LoadingScreen />}
					{step === STEP_NEW_USER && (
						<RegistrationForm
							username={username}
							realName={realName}
							onChange={setRealName}
							onSubmit={handleRegistration}
							onBack={handleBackToUsername}
							isLoading={isLoading}
							error={error}
							tutorialText={tutorialText}
							showCursor={showCursor}
							typingComplete={typingComplete}
						/>
					)}
					{step === STEP_COMPLETE && <CompleteScreen />}
					{step !== STEP_WELCOME && (
						<div className="mt-4 text-center text-xs text-gray-700">
							<p>PROJECT CLARITY · AUTONOMOUS BUILD</p>
						</div>
					)}
				</div>
			</div>

			<CRTEffects />
		</div>
	);
};

export default Landing;
