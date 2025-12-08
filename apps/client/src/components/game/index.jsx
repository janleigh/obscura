import { useEffect, useState } from "react";
import { getLevelById } from "../../../../../packages/shared/levels";
import { useLevelSubmission } from "../../hooks/useLevelSubmission";
import CipherTools from "../cipher-tools";
import PhaseKeys from "../PhaseKeys";
import Terminal from "../terminal";
import NotebookPanel from "./NotebookPanel";
import PuzzlePanel from "./PuzzlePanel";
import SubmissionFeedback from "./SubmissionFeedback";
import TabNavigation from "./TabNavigation";
import TutorialOverlay from "./TutorialOverlay";

const MainGame = ({ userData, currentLevel, onUserDataUpdate }) => {
	const [activeTab, setActiveTab] = useState("solver");
	const [notes, setNotes] = useState("");
	const [showTutorial, setShowTutorial] = useState(true);
	const [showingStoryFragment, setShowingStoryFragment] =
		useState(false);
	const [storyFragmentText, setStoryFragmentText] = useState("");

	const { isSubmitting, message, submitAnswer, setMessage } =
		useLevelSubmission(
			userData,
			currentLevel,
			onUserDataUpdate,
			(fragment) => {
				// Callback to show story fragment
				setStoryFragmentText(fragment);
				setShowingStoryFragment(true);
				// Hide after typing completes + delay
				setTimeout(
					() => {
						setShowingStoryFragment(false);
						setMessage(null);
					},
					fragment.length * 20 + 10000
				); // typing duration + 10s delay
			}
		);

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

	// Clear notes when level changes
	useEffect(() => {
		setNotes("");
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
			{showTutorial && currentLevel === 0 && (
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
				<div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
					<div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
						<PuzzlePanel
							level={level}
							showingStoryFragment={showingStoryFragment}
							storyFragmentText={storyFragmentText}
						/>
						<NotebookPanel notes={notes} onChange={setNotes} />
					</div>
					{/* Terminal Input */}
					<div className="h-32 shrink-0">
						<Terminal
							onSubmit={submitAnswer}
							isProcessing={isSubmitting}
							feedback={
								<SubmissionFeedback message={message} />
							}
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
					<CipherTools />
				</div>
			)}
		</div>
	);
};

export default MainGame;
