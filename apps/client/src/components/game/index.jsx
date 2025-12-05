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

	const { isSubmitting, message, submitAnswer } = useLevelSubmission(
		userData,
		currentLevel,
		onUserDataUpdate
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
						<div className="max-w-lg space-y-6 border border-cyan-800 bg-[#0a0a0a] p-8 text-center">
							<div className="text-xs tracking-widest text-gray-500">
								[ TRANSMISSION COMPLETE ]
							</div>
							<div className="text-2xl font-bold text-cyan-400">
								CALIBRATION MODULES EXHAUSTED
							</div>
							<div className="space-y-4 text-sm text-gray-400">
								<p>
									You have successfully completed all available calibration modules.
									Your linguistic patterns have been recorded.
								</p>
								<p className="text-cyan-600">
									Standby for further transmissions...
								</p>
							</div>
							<div className="border-t border-gray-800 pt-4">
								<div className="text-xs text-gray-600">
									Levels Completed: {currentLevel}
								</div>
							</div>
						</div>
						<div className="text-xs text-gray-600">
							Explore PHASE KEYS or CIPHER TOOLKIT while awaiting new modules.
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
		<div className="flex h-full flex-col">
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
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="grid min-h-[400px] grid-cols-2 gap-4">
						<PuzzlePanel level={level} />
						<NotebookPanel notes={notes} onChange={setNotes} />
					</div>
					{/* Terminal Input */}
					<div className="h-32 shrink-0 border border-gray-800 bg-black">
						<Terminal
							onSubmit={submitAnswer}
							isProcessing={isSubmitting}
						/>
					</div>
					{/* Submission Feedback */}
					<SubmissionFeedback message={message} />
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
