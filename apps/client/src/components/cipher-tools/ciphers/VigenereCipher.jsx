import { useState } from "react";
import { solveVigenere } from "../../../../../../packages/shared/cipherUtils";
import Button from "../../shared/Button";

const VigenereCipher = ({ cipherText, keyValue, onKeyChange, addLog }) => {
	const [vigenereCrackState, setVigenereCrackState] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const initiateAnalysis = async () => {
		if (!cipherText.trim()) {
			addLog("ERROR", "Enter cipher text for key analysis");
			return;
		}

		setVigenereCrackState(null);
		setIsLoading(true);
		addLog("INFO", "Initializing cryptanalysis engine...");

		await new Promise((resolve) => setTimeout(resolve, 600));
		addLog("SCAN", "Calculating Index of Coincidence...");

		const result = solveVigenere(cipherText);

		await new Promise((resolve) => setTimeout(resolve, 800));

		if (result) {
			addLog(
				"ANALYSIS",
				`Detected probable key length: ${result.keyLength}`
			);
			await new Promise((resolve) => setTimeout(resolve, 400));
			addLog("SUCCESS", `Key candidate found: ${result.key}`);

			setVigenereCrackState({
				key: result.key,
				keyLength: result.keyLength,
				confidence: result.confidence,
				hint: `Try using the key '${result.key}' to decrypt.`
			});
		} else {
			addLog("WARN", "Insufficient data for analysis.");
		}

		setIsLoading(false);
	};

	return (
		<div className="space-y-3">
			<div className="border-l-2 border-blue-500 bg-blue-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-blue-400">
						KEYHUNT MODULE
					</div>
					<div className="text-[10px] text-blue-600">v4.0.0</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					Polyalphabetic substitution analyzer. Automated key
					recovery.
				</div>
			</div>
			<div className="space-y-2 border border-gray-800 bg-black/40 p-3">
				<label className="text-[10px] text-gray-500">
					DECRYPTION KEY PARAMETER
				</label>
				<input
					type="text"
					value={keyValue}
					onChange={(e) =>
						onKeyChange(e.target.value.toUpperCase())
					}
					placeholder="ENTER KEY..."
					className="w-full border border-gray-700 bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-green-400 transition-colors outline-none focus:border-green-400 focus:bg-green-950/10"
				/>
			</div>
			<Button
				onClick={initiateAnalysis}
				disabled={!cipherText.trim() || isLoading}
				variant="primary"
				className="w-full font-bold"
			>
				{isLoading ? "[ ANALYZING... ]" : "[ RUN KEY ANALYSIS ]"}
			</Button>
			{vigenereCrackState && (
				<div className="animate-in fade-in space-y-2 border border-blue-700 bg-blue-950/20 p-3 text-xs duration-500">
					<div className="flex items-center justify-between border-b border-blue-800 pb-2">
						<div className="font-bold text-blue-400">
							ANALYSIS RESULTS [EXPERIMENTAL]
						</div>
						<div className="text-[10px] text-blue-300/70">
							CONFIDENCE:{" "}
							{(
								vigenereCrackState.confidence * 1000
							).toFixed(0)}
							%
						</div>
					</div>
					<div className="space-y-2 pt-1">
						<div className="flex items-start gap-2">
							<span className="text-blue-500">►</span>
							<div className="text-gray-300">
								{vigenereCrackState.hint}
							</div>
						</div>
						<div className="flex items-center gap-2 rounded bg-black/40 p-2">
							<span className="text-[10px] text-gray-500">
								DETECTED KEY:
							</span>
							<span className="font-mono text-lg font-bold text-green-400">
								{vigenereCrackState.key}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default VigenereCipher;
