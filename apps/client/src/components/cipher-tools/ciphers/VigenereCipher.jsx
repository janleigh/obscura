import { useState } from "react";
import Button from "../../shared/Button";

const ENGLISH_FREQS = {
	A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 13.0, F: 2.2, G: 2.0, H: 6.1, I: 7.0, J: 0.15, K: 0.77, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9, Q: 0.095, R: 6.0, S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15, Y: 2.0, Z: 0.074
};

const calculateIC = (text) => {
	const counts = {};
	const len = text.length;
	if (len <= 1) return 0;
	for (let char of text) {
		counts[char] = (counts[char] || 0) + 1;
	}
	let sum = 0;
	for (let char in counts) {
		sum += counts[char] * (counts[char] - 1);
	}
	return sum / (len * (len - 1));
};

// this probably works but the key detector is highly experimental and inaccurate
const solveVigenere = (ciphertext) => {
	const cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
	if (cleanText.length < 2) return null;
	
	const maxKeyLen = Math.min(20, Math.floor(cleanText.length / 2));
	let bestKeyLen = 1;
	let bestAvgIC = 0;

	// Find key length
	for (let len = 1; len <= maxKeyLen; len++) {
		let avgIC = 0;
		for (let i = 0; i < len; i++) {
			let slice = "";
			for (let j = i; j < cleanText.length; j += len) {
				slice += cleanText[j];
			}
			avgIC += calculateIC(slice);
		}
		avgIC /= len;
		if (Math.abs(avgIC - 0.067) < Math.abs(bestAvgIC - 0.067)) {
			bestAvgIC = avgIC;
			bestKeyLen = len;
		}
	}

	// Find key
	let key = "";
	for (let i = 0; i < bestKeyLen; i++) {
		let slice = "";
		for (let j = i; j < cleanText.length; j += bestKeyLen) {
			slice += cleanText[j];
		}
		
		let bestShift = 0;
		let minChi2 = Infinity;

		for (let shift = 0; shift < 26; shift++) {
			let chi2 = 0;
			const counts = {};
			for (let char of slice) {
				let shiftedChar = String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
				counts[shiftedChar] = (counts[shiftedChar] || 0) + 1;
			}
			
			for (let charCode = 65; charCode <= 90; charCode++) {
				const char = String.fromCharCode(charCode);
				const observed = counts[char] || 0;
				const expected = (ENGLISH_FREQS[char] / 100) * slice.length;
				chi2 += Math.pow(observed - expected, 2) / expected;
			}

			if (chi2 < minChi2) {
				minChi2 = chi2;
				bestShift = shift;
			}
		}
		key += String.fromCharCode(bestShift + 65);
	}
	return { key, keyLength: bestKeyLen, confidence: bestAvgIC };
};

const VigenereCipher = ({
	cipherText,
	keyValue,
	onKeyChange,
	addLog
}) => {
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
			addLog("ANALYSIS", `Detected probable key length: ${result.keyLength}`);
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
					Polyalphabetic substitution analyzer. Automated key recovery.
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
					className="w-full border border-gray-700 bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-green-400 outline-none transition-colors focus:border-green-400 focus:bg-green-950/10"
				/>
			</div>
			<Button
				onClick={initiateAnalysis}
				disabled={!cipherText.trim() || isLoading}
				variant="primary"
				className="w-full font-bold">
				{isLoading ? "[ ANALYZING... ]" : "[ RUN KEY ANALYSIS ]"}
			</Button>
			{vigenereCrackState && (
				<div className="animate-in fade-in duration-500 space-y-2 border border-blue-700 bg-blue-950/20 p-3 text-xs">
					<div className="flex items-center justify-between border-b border-blue-800 pb-2">
						<div className="font-bold text-blue-400">
							ANALYSIS RESULTS [EXPERIMENTAL]
						</div>
						<div className="text-[10px] text-blue-300/70">
							CONFIDENCE: {(vigenereCrackState.confidence * 1000).toFixed(0)}%
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
