import { useState } from "react";
import PipeGame from "../components/minigames/PipeGame";

/**
 * MinigameWrapper - Wraps cipher tool actions to require minigame completion first
 * Usage: Wrap your onDecrypt or onBruteForce handlers with this
 */
export const useMinigameGate = () => {
	const [showMinigame, setShowMinigame] = useState(false);
	const [pendingAction, setPendingAction] = useState(null);

	const withMinigame = (callback) => {
		return () => {
			setPendingAction(() => callback);
			setShowMinigame(true);
		};
	};

	const handleMinigameComplete = () => {
		setShowMinigame(false);
		if (pendingAction) {
			pendingAction();
			setPendingAction(null);
		}
	};

	return {
		showMinigame,
		setShowMinigame,
		withMinigame,
		handleMinigameComplete,
		PipeGameComponent: PipeGame,
		showPipeGame: showMinigame,
		closePipeGame: () => setShowMinigame(false)
	};
};

export default useMinigameGate;
