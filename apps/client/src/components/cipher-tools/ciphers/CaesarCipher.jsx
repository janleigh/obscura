import axios from "axios";
import { useState } from "react";
import { useMinigameGate } from "../../../hooks/useMinigameGate";
import { API_ENDPOINTS } from "../../../config/api";
import Button from "../../shared/Button";
import ProgressBar from "../ProgressBar";

const CaesarCipher = ({ cipherText, addLog }) => {
	const [shift, setShift] = useState(3);
	const [bruteForceProgress, setBruteForceProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState("");
	const [error, setError] = useState("");
	const { withMinigame, PipeGameComponent, showPipeGame, closePipeGame, handleMinigameComplete } = useMinigameGate();

	const caesarBruteForce = async () => {
		if (!cipherText.trim()) {
			setError("Enter cipher text to crack");
			addLog("ERROR", "No input provided for ROT-CRACK");
			return;
		}

		addLog("INFO", "Initializing ROT-CRACK brute force attack...");
		setIsLoading(true);
		setError("");
		setResult("");
		setBruteForceProgress(0);

		await new Promise((resolve) => setTimeout(resolve, 300));
		addLog("SCAN", "Loading character set...");
		await new Promise((resolve) => setTimeout(resolve, 200));
		addLog("SCAN", "Initializing rotation vectors...");
		await new Promise((resolve) => setTimeout(resolve, 250));

		for (let i = 1; i <= 25; i++) {
			await new Promise((resolve) => setTimeout(resolve, 150));
			setBruteForceProgress((i / 25) * 100);
			addLog("SCAN", `Testing shift ${i}/25...`);
		}

		await new Promise((resolve) => setTimeout(resolve, 300));
		addLog("ANALYSIS", "Analyzing results for readable plaintext...");
		await new Promise((resolve) => setTimeout(resolve, 400));

		try {
			const payload = {
				ciphertext: cipherText,
				cipherType: "caesar",
				config: { shift }
			};

			const response = await axios.post(
				API_ENDPOINTS.CIPHER_DECRYPT,
				payload
			);

			if (response.data.plaintext !== undefined) {
				setResult(response.data.plaintext);
				addLog(
					"SUCCESS",
					`Plaintext recovered with shift ${shift}`
				);
			} else {
				setError("Decryption failed");
				addLog("ERROR", "ROT-CRACK failed to recover plaintext");
			}
		} catch (err) {
			setError(
				err.response?.data?.message || "Brute force attack failed"
			);
			addLog(
				"ERROR",
				err.response?.data?.message || "Attack failed"
			);
		} finally {
			setIsLoading(false);
			setBruteForceProgress(0);
		}
	};

	return (
		<div className="space-y-3">
			<div className="border border-yellow-900 bg-yellow-950/20 p-3">
				<div className="mb-2 text-xs text-yellow-400">
					ROT-CRACK [BRUTE FORCE]
				</div>
				<div className="text-[10px] text-gray-500">
					This tool will attempt all 25 possible shift values to
					crack the Caesar cipher.
				</div>
			</div>
			<div className="space-y-2">
				<label className="text-xs text-gray-500">
					MANUAL SHIFT OVERRIDE
				</label>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setShift(Math.max(0, shift - 1))}
						className="border border-gray-700 bg-[#0a0a0a] px-3 py-1 text-xs text-green-400 hover:border-green-400">
						◀
					</button>
					<div className="flex-1 text-center">
						<span className="text-xl font-bold text-green-400">
							{shift}
						</span>
						<div className="text-[10px] text-gray-600">
							SHIFT VALUE
						</div>
					</div>
					<button
						onClick={() => setShift(Math.min(25, shift + 1))}
						className="border border-gray-700 bg-[#0a0a0a] px-3 py-1 text-xs text-green-400 hover:border-green-400">
						▶
					</button>
				</div>
			</div>
			<ProgressBar
				progress={bruteForceProgress}
				label="BRUTE FORCE PROGRESS"
			/>
			<Button
				onClick={withMinigame(caesarBruteForce)}
				disabled={isLoading || !cipherText.trim()}
				variant="success"
				className="w-full font-bold">
				{isLoading ? "PROCESSING..." : "INITIATE BRUTE FORCE"}
			</Button>
			{error && (
				<div className="border border-red-700 bg-red-950/30 p-3 text-xs text-red-300">
					{error}
				</div>
			)}
			{result && (
				<div className="border border-green-700 bg-green-950/20 p-3">
					<div className="mb-2 text-xs font-bold text-green-400">
						DECRYPTION SUCCESSFUL
					</div>
					<div className="border border-gray-700 bg-[#0a0a0a] p-3 font-mono text-xs break-all text-green-400">
						{result}
					</div>
				</div>
			)}
			{showPipeGame && (
				<PipeGameComponent
					onComplete={handleMinigameComplete}
					onClose={closePipeGame}
				/>
			)}
		</div>
	);
};

export default CaesarCipher;
