import { useState } from "react";
import {
	calculateFrequencies,
	getTopFrequentChars,
} from "../../../../../../packages/shared/cipherUtils";
import Button from "../../shared/Button";
import useMinigameGate from "../../../hooks/useMinigameGate";

const VigenereCipher = ({ cipherText, keyValue, onKeyChange, addLog }) => {
	const [vigenereCrackState, setVigenereCrackState] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { withMinigame, PipeGameComponent, showPipeGame, closePipeGame, handleMinigameComplete } = useMinigameGate();

	const analyzeVigenereKey = async () => {
		if (!cipherText.trim()) {
			addLog("ERROR", "Enter cipher text for key analysis");
			return;
		}

		addLog("INFO", "Starting KEYHUNT frequency analysis...");
		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 400));
		addLog("SCAN", "Parsing ciphertext...");

		await new Promise((resolve) => setTimeout(resolve, 500));
		addLog("ANALYSIS", "Computing character frequencies...");

		const frequencies = calculateFrequencies(cipherText);

		await new Promise((resolve) => setTimeout(resolve, 600));
		addLog("ANALYSIS", "Performing statistical analysis...");

		const sorted = getTopFrequentChars(frequencies, 5);

		await new Promise((resolve) => setTimeout(resolve, 300));
		addLog(
			"ANALYSIS",
			`Most frequent chars: ${sorted.map(([c, f]) => `${c}(${f})`).join(", ")}`
		);
		await new Promise((resolve) => setTimeout(resolve, 200));
		addLog(
			"HINT",
			"In English, 'E' is most common. Compare frequencies!"
		);

		setVigenereCrackState({
			frequencies,
			mostCommon: sorted[0][0],
			hint: `If '${sorted[0][0]}' represents 'E', try keys starting with that offset`
		});
		setIsLoading(false);
	};

	return (
		<div className="space-y-3">
			<div className="border border-blue-900 bg-blue-950/20 p-3">
				<div className="mb-2 text-xs text-blue-400">
					KEYHUNT [VIGENERE ANALYZER]
				</div>
				<div className="text-[10px] text-gray-500">
					Frequency analysis tool to help identify potential key
					patterns.
				</div>
			</div>
			<div className="space-y-2">
				<label className="text-xs text-gray-500">
					DECRYPTION KEY
				</label>
				<input
					type="text"
					value={keyValue}
					onChange={(e) =>
						onKeyChange(e.target.value.toUpperCase())
					}
					placeholder="Enter suspected key..."
					className="w-full border border-gray-700 bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-green-400 outline-none focus:border-green-400"
				/>
			</div>
			<Button
				onClick={withMinigame(analyzeVigenereKey)}
				disabled={!cipherText.trim() || isLoading}
				variant="primary"
				className="w-full">
				[ RUN FREQUENCY ANALYSIS ]
			</Button>
			{vigenereCrackState && (
				<div className="space-y-2 border border-blue-700 bg-blue-950/20 p-3 text-xs">
					<div className="font-bold text-blue-400">
						ANALYSIS RESULTS:
					</div>
					<div className="text-gray-400">
						{vigenereCrackState.hint}
					</div>
					<div className="text-[10px] text-gray-600">
						Most frequent character:{" "}
						<span className="text-green-400">
							{vigenereCrackState.mostCommon}
						</span>
					</div>
				</div>
			)}
			{showPipeGame && <PipeGameComponent onComplete={handleMinigameComplete} onClose={closePipeGame} />}
		</div>
	);
};

export default VigenereCipher;
