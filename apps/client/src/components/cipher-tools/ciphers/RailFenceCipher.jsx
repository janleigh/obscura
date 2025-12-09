import axios from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../../../config/api";
import { useSound } from "../../../hooks/useSound";
import Button from "../../shared/Button";
import CipherInputForm from "../CipherInputForm";
import { NodeGame } from "../minigames";

const RailFenceCipher = ({
	cipherText,
	onCipherTextChange,
	rails,
	onRailsChange,
	addLog
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState("");
	const [error, setError] = useState("");
	const [showMinigame, setShowMinigame] = useState(false);
	const [_delay, setDelay] = useState(0);
	const { playSound } = useSound();

	const initRailGame = () => {
		if (!cipherText.trim()) {
			setError("Enter cipher text for Rail Puzzle");
			return;
		}

		setError("");
		setDelay(0);
		setResult("");
		addLog("INFO", "Launching two-factor authentication...");
		setShowMinigame(true);
	};

	const handleMinigameSuccess = (showSuccess, additionalDelay = 0) => {
		setShowMinigame(false);

		if (showSuccess === true) {
			addLog(
				"SUCCESS",
				"Verification completed - Starting decryption..."
			);
		}

		railFenceBruteForce(additionalDelay);
	};

	const handleMinigameCancel = () => {
		setShowMinigame(false);
		addLog("INFO", "Verification aborted");
	};

	const handleMinigameFailure = () => {
		setShowMinigame(false);
		addLog("WARN", "Verification failed - Adding security delay...");
		const punishmentDelay = 700;
		setDelay(punishmentDelay);
		handleMinigameSuccess(undefined, punishmentDelay);
	};

	const railFenceBruteForce = async (additionalDelay = 0) => {
		if (!cipherText.trim()) {
			setError("Enter cipher text to crack");
			addLog("ERROR", "No input provided for RAIL-FNC");
			return;
		}

		addLog("WARNING", "Initiating RAIL-FNC decryptor...");
		setIsLoading(true);
		setError("");
		setResult("");

		await new Promise((resolve) =>
			setTimeout(resolve, 500 + additionalDelay)
		);
		addLog("SCAN", `Decrypting with ${rails} rails...`);

		await new Promise((resolve) =>
			setTimeout(resolve, 400 + additionalDelay)
		);
		addLog("ANALYSIS", "Analyzing results for readable plaintext...");

		try {
			const payload = {
				ciphertext: cipherText,
				cipherType: "railfence",
				config: { rails }
			};

			const response = await axios.post(
				API_ENDPOINTS.CIPHER_DECRYPT,
				payload
			);

			if (response.data.plaintext !== undefined) {
				setResult(response.data.plaintext);
				playSound("ciphertoolFinish");
				addLog(
					"SUCCESS",
					`Plaintext recovered using ${rails} rails`
				);
			} else {
				setError("Decryption failed");
				addLog("ERROR", "Unable to decrypt ciphertext");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Decryption failed");
			addLog(
				"ERROR",
				err.response?.data?.message || "Decryption failed"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-3">
			<div className="border-l-2 border-purple-500 bg-purple-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-purple-400">
						RAIL-FNC MODULE
					</div>
					<div className="text-[10px] text-purple-600">
						v2.3.1
					</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					Zigzag transposition cipher. Requires rail count
					parameter.
				</div>
			</div>
			<CipherInputForm
				value={cipherText}
				onChange={onCipherTextChange}
			/>
			<div className="space-y-2 border border-gray-800 bg-black/40 p-3">
				<label className="text-[10px] text-gray-500">
					CONFIGURATION PARAMETERS
				</label>
				<div className="flex items-center justify-between gap-4">
					<div className="text-xs text-purple-400">
						RAIL COUNT
					</div>
					<div className="flex items-center gap-1">
						<button
							onClick={() =>
								onRailsChange(Math.max(2, rails - 1))
							}
							className="flex h-8 w-8 items-center justify-center border border-gray-700 bg-[#0a0a0a] text-xs text-purple-400 transition-colors hover:border-purple-500 hover:bg-purple-950/20"
						>
							◀
						</button>
						<div className="flex h-8 w-16 items-center justify-center border border-gray-800 bg-black font-mono text-lg font-bold text-purple-400">
							{rails}
						</div>
						<button
							onClick={() =>
								onRailsChange(Math.min(10, rails + 1))
							}
							className="flex h-8 w-8 items-center justify-center border border-gray-700 bg-[#0a0a0a] text-xs text-purple-400 transition-colors hover:border-purple-500 hover:bg-purple-950/20"
						>
							▶
						</button>
					</div>
				</div>
			</div>
			{/* Minigame Modal */}
			{showMinigame && (
				<NodeGame
					onSuccess={handleMinigameSuccess}
					onCancel={handleMinigameCancel}
					onFailure={handleMinigameFailure}
				/>
			)}
			<Button
				onClick={initRailGame}
				disabled={isLoading || !cipherText.trim()}
				variant="success"
				className="w-full font-bold"
			>
				{isLoading ? "PROCESSING..." : "EXECUTE DECRYPT"}
			</Button>
			{error && (
				<div className="border border-red-700 bg-red-950/30 p-3 text-xs text-red-300">
					{error}
				</div>
			)}
			{result && (
				<div className="animate-in fade-in border border-green-700 bg-green-950/20 p-3 duration-500">
					<div className="mb-2 flex items-center justify-between">
						<div className="text-xs font-bold text-green-400">
							DECRYPTION SUCCESSFUL
						</div>
						<button
							onClick={() => {
								navigator.clipboard.writeText(result);
								addLog(
									"SUCCESS",
									"Result copied to clipboard"
								);
							}}
							className="text-[10px] font-bold text-green-600 hover:text-green-400"
						>
							[COPY RESULT]
						</button>
					</div>
					<div className="border border-gray-700 bg-[#0a0a0a] p-3">
						<div className="font-mono text-xs break-all text-green-400">
							{result}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default RailFenceCipher;
