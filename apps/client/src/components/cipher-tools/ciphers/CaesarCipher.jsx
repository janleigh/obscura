import axios from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../../../config/api";
import { useSound } from "../../../hooks/useSound";
import Button from "../../shared/Button";
import CipherInputForm from "../CipherInputForm";
import ProgressBar from "../ProgressBar";
import { VAPEGame, ZoneWallGame } from "../minigames";

const CaesarCipher = ({ cipherText, onCipherTextChange, addLog }) => {
	const [delay, setDelay] = useState(0);
	const [bruteForceProgress, setBruteForceProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState([]);
	const [error, setError] = useState("");
	const [showMinigame, setShowMinigame] = useState(false);
	const [minigameType, setMinigameType] = useState(null);
	const { playSound } = useSound();

	const initiateBruteForce = () => {
		if (!cipherText.trim()) {
			setError("Enter cipher text to crack");
			addLog("ERROR", "No input provided for ROT-CRACK");
			return;
		}

		setError("");
		setDelay(0);
		setResults([]);
		addLog("INFO", "Launching two-factor authentication...");
		// Randomly select a minigame (alternating between VAPE and ZoneWall for variety)
		const games = ["vape", "zonewall"];
		const selectedGame =
			games[Math.floor(Math.random() * games.length)];
		setMinigameType(selectedGame);
		setShowMinigame(true);
	};

	const handleMinigameFailure = () => {
		setShowMinigame(false);
		addLog("WARN", "Verification failed - Adding security delay...");
		setDelay(300);
		handleMinigameSuccess();
	};

	const handleMinigameSuccess = async (showSuccess) => {
		setShowMinigame(false);

		if (showSuccess === true) {
			addLog(
				"SUCCESS",
				"Verification completed - Initiating decryption..."
			);
		}

		setIsLoading(true);
		setError("");
		setBruteForceProgress(0);

		await new Promise((resolve) => setTimeout(resolve, 300));
		addLog("SCAN", "Loading character set...");
		await new Promise((resolve) => setTimeout(resolve, 200));
		addLog("SCAN", "Initializing rotation vectors...");
		await new Promise((resolve) => setTimeout(resolve, 250));

		const allResults = [];

		for (let i = 1; i <= 25; i++) {
			await new Promise((resolve) =>
				setTimeout(resolve, 150 + delay)
			);
			setBruteForceProgress((i / 25) * 100);

			try {
				// Decrypt with current shift
				const payload = {
					ciphertext: cipherText,
					cipherType: "caesar",
					config: { shift: i }
				};

				const response = await axios.post(
					API_ENDPOINTS.CIPHER_DECRYPT,
					payload
				);

				if (response.data.plaintext !== undefined) {
					const newResult = {
						shift: i,
						plaintext: response.data.plaintext
					};
					allResults.push(newResult);
					setResults((prev) => [...prev, newResult]);
					addLog("SCAN", `Testing shift ${i}/25`);
				}
			} catch (err) {
				// Silently continue if a specific shift fails
				addLog("WARN", `Shift ${i} failed, continuing...`);
			}
		}

		await new Promise((resolve) => setTimeout(resolve, 300));

		if (allResults.length > 0) {
			addLog("ANALYSIS", "All shifts processed successfully");
			playSound("ciphertoolFinish");
			addLog(
				"SUCCESS",
				`Generated ${allResults.length} possible plaintexts`
			);
		} else {
			setError("Brute force attack failed - no results generated");
			addLog("ERROR", "Attack failed - no plaintexts recovered");
		}

		setIsLoading(false);
		setBruteForceProgress(0);
	};

	const handleMinigameCancel = () => {
		setShowMinigame(false);
		setMinigameType(null);
		addLog("INFO", "Verification aborted");
	};

	return (
		<div className="space-y-3">
			<div className="border-l-2 border-yellow-600 bg-yellow-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-yellow-500">
						ROT-CRACK MODULE
					</div>
					<div className="text-[10px] text-yellow-700">v2.0.4</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					Automated brute-force analysis of rotation-based ciphers.
				</div>
			</div>
			<CipherInputForm
				value={cipherText}
				onChange={onCipherTextChange}
			/>
			<ProgressBar
				progress={bruteForceProgress}
				label="BRUTE FORCE PROGRESS"
			/>
			<Button
				onClick={initiateBruteForce}
				disabled={isLoading || !cipherText.trim()}
				variant="success"
				className="w-full font-bold">
				{isLoading ? "PROCESSING..." : "INITIATE BRUTE FORCE"}
			</Button>
			{/* Minigame Modal */}
			{showMinigame && minigameType === "vape" && (
				<VAPEGame
					onSuccess={handleMinigameSuccess}
					onCancel={handleMinigameCancel}
					onFailure={handleMinigameFailure}
				/>
			)}
			{showMinigame && minigameType === "zonewall" && (
				<ZoneWallGame
					onSuccess={handleMinigameSuccess}
					onCancel={handleMinigameCancel}
					onFailure={handleMinigameFailure}
				/>
			)}
			{error && (
				<div className="border border-red-700 bg-red-950/30 p-3 text-xs text-red-300">
					{error}
				</div>
			)}
			{results.length >= 25 && (
				<div className="animate-in fade-in duration-500 border border-green-700 bg-green-950/20 p-3">
					<div className="mb-2 flex items-center justify-between">
						<div className="text-xs font-bold text-green-400">
							DECRYPTION RESULTS
						</div>
						<div className="text-[10px] text-green-600/70">
							{results.length} CANDIDATES FOUND
						</div>
					</div>
					<div className="scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black max-h-[400px] overflow-y-auto border border-gray-700 bg-[#0a0a0a] p-2">
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							{results.map(({ shift, plaintext }) => (
								<div
									key={shift}
									className="group relative flex flex-col gap-1 border border-gray-800 bg-black/40 p-2 transition-all hover:border-green-500/50 hover:bg-green-950/10">
									<div className="mb-1 flex items-center justify-between border-b border-gray-800 pb-1 group-hover:border-green-900/50">
										<span className="font-mono text-[10px] text-gray-500 group-hover:text-green-400/70">
											SHIFT +{shift}
										</span>
										<button
											onClick={() => {
												navigator.clipboard.writeText(
													plaintext
												);
												addLog(
													"SUCCESS",
													`Copied result for shift ${shift}`
												);
											}}
											className="hidden text-[10px] font-bold text-green-500 hover:text-green-300 group-hover:block">
											[COPY]
										</button>
									</div>
									<div className="break-all font-mono text-xs text-gray-300 group-hover:text-green-400">
										{plaintext}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CaesarCipher;
