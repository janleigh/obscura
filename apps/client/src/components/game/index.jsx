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

	if (!level) {
		return (
			<div className="text-center text-red-400">
				<p>Error: Level {currentLevel} not found</p>
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
