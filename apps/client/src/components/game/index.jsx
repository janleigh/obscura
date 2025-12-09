import { useEffect, useRef, useState } from "react";
import { getLevelById } from "../../../../../packages/shared/levels";
import { useLevelSubmission } from "../../hooks/useLevelSubmission";
import CipherTools from "../cipher-tools";
import PhaseKeys from "../PhaseKeys";
import Terminal from "../terminal";
import NotebookPanel from "./NotebookPanel";
import PuzzlePanel from "./PuzzlePanel";
import TabNavigation from "./TabNavigation";
import TutorialOverlay from "./TutorialOverlay";

const MainGame = ({
	userData,
	currentLevel,
	onUserDataUpdate,
	isLogin = false
}) => {
	const [activeTab, setActiveTab] = useState("solver");
	const [notes, setNotes] = useState("");
	const [showTutorial, setShowTutorial] = useState(!isLogin); // Don't show tutorial for login users
	const [showingStoryFragment, setShowingStoryFragment] =
		useState(false);
	const [storyFragmentText, setStoryFragmentText] = useState("");
	const [pendingLevelData, setPendingLevelData] = useState(null);

	// Track initial focus for terminal
	const initialFocusRef = useRef(true);
	useEffect(() => {
		initialFocusRef.current = false;
	}, []);

	// biome-ignore lint/correctness/noUnusedVariables: intended
	const { isSubmitting, message, submitAnswer, setMessage } =
		useLevelSubmission(
			userData,
			currentLevel,
			onUserDataUpdate,
			(fragment, levelData) => {
				// Callback to show story fragment
				setStoryFragmentText(fragment);
				setShowingStoryFragment(true);
				setPendingLevelData(levelData);
			}
		);

	const handleStoryFragmentContinue = () => {
		if (pendingLevelData && onUserDataUpdate) {
			onUserDataUpdate({
				...pendingLevelData.userData,
				currentLevel: pendingLevelData.nextLevelId,
				completedLevels: [
					...(pendingLevelData.userData.completedLevels || []),
					pendingLevelData.currentLevel
				]
			});
			setPendingLevelData(null);
		}
	};

	const level = getLevelById(currentLevel);

	// ESC to close tutorial
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && showTutorial) {
				setShowTutorial(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [showTutorial]);

	// Clear notes and reset story fragment when level changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: true
	useEffect(() => {
		setNotes("");
		setShowingStoryFragment(false);
		setStoryFragmentText("");
		setPendingLevelData(null);
	}, [currentLevel]);

	// Fallback when no more levels are available
	if (!level) {
		return (
			<div className="flex h-full flex-col">
				<TabNavigation
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onShowTutorial={() => setShowTutorial(true)}
				/>
				{activeTab === "solver" && (
					<div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
						<div className="max-w-lg space-y-6 border border-cyan-800 bg-[#0a0a0a] p-8 text-center shadow-[0_0_30px_rgba(8,145,178,0.1)]">
							<div className="flex items-center justify-center gap-2 text-xs tracking-widest text-gray-500">
								<span className="h-px w-8 bg-gray-800"></span>
								[ TRANSMISSION COMPLETE ]
								<span className="h-px w-8 bg-gray-800"></span>
							</div>
							<div className="text-2xl font-bold text-cyan-400">
								CALIBRATION MODULES EXHAUSTED
							</div>
							<div className="space-y-4 text-sm text-gray-400">
								<p>
									You have successfully completed all
									available calibration modules. Your
									linguistic patterns have been recorded.
								</p>
								<p className="animate-pulse text-cyan-600">
									Standby for further transmissions...
								</p>
							</div>
							<div className="border-t border-gray-800 pt-4">
								<div className="flex justify-center gap-4 text-xs text-gray-600">
									<span>
										LEVELS COMPLETED:{" "}
										<span className="text-green-400">
											{currentLevel}
										</span>
									</span>
									<span>
										STATUS:{" "}
										<span className="text-cyan-400">
											AWAITING DATA
										</span>
									</span>
								</div>
							</div>
						</div>
						<div className="text-xs text-gray-600">
							Explore PHASE KEYS or CIPHER TOOLKIT while
							awaiting new modules.
						</div>
					</div>
				)}
				{activeTab === "phasekeys" && (
					<div className="flex-1 overflow-hidden">
						<PhaseKeys />
					</div>
				)}
				{activeTab === "ciphertools" && (
					<div className="flex-1 p-4">
						<CipherTools />
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="relative flex h-full w-full flex-col">
			{/* Tutorial Overlay */}
			{showTutorial && (
				<TutorialOverlay onClose={() => setShowTutorial(false)} />
			)}
			{/* Tab Navigation */}
			<TabNavigation
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onShowTutorial={() => setShowTutorial(true)}
			/>
			{/* Solver Tab */}
			{activeTab === "solver" && (
				<div className="flex flex-col gap-2 p-2 md:gap-4 md:p-4">
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
						<div className="flex flex-col">
							<PuzzlePanel
								level={level}
								showingStoryFragment={showingStoryFragment}
								storyFragmentText={storyFragmentText}
								onStoryFragmentContinue={handleStoryFragmentContinue}
							/>
						</div>
						<div className="flex flex-col">
							<NotebookPanel
								notes={notes}
								onChange={setNotes}
							/>
						</div>
					</div>
					{/* Terminal Input */}
					<div className="h-24 shrink-0 md:h-32">
						<Terminal
							onSubmit={submitAnswer}
							isProcessing={isSubmitting}
							message={message}
							shouldAutoFocus={initialFocusRef.current}
						/>
					</div>
				</div>
			)}
			{/* Phase Keys Tab */}
			{activeTab === "phasekeys" && (
				<div className="flex-1 overflow-hidden">
					<PhaseKeys />
				</div>
			)}
			{/* Cipher Tools Tab */}
			{activeTab === "ciphertools" && (
				<div className="flex-1 p-4">
					<CipherTools isActive={activeTab === "ciphertools"} />
				</div>
			)}
		</div>
	);
};

export default MainGame;
