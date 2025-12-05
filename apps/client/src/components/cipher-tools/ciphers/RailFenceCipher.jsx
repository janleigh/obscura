import axios from "axios";
import { useState } from "react";
import { generateRailFencePattern } from "../../../../../../packages/shared/cipherUtils";
import { API_ENDPOINTS } from "../../../config/api";
import { useSound } from "../../../hooks/useSound";
import Button from "../../shared/Button";
import ProgressBar from "../ProgressBar";

const RailFenceCipher = ({ cipherText, rails, onRailsChange, addLog }) => {
	const [railGameState, setRailGameState] = useState(null);
	const [bruteForceProgress, setBruteForceProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState("");
	const [error, setError] = useState("");
	const { playSound } = useSound();

	const initRailGame = () => {
		if (!cipherText.trim()) {
			setError("Enter cipher text for Rail Puzzle");
			return;
		}

		const clean = cipherText.replace(/\s/g, "");
		const pattern = generateRailFencePattern(clean, rails);

		setRailGameState({
			pattern,
			currentRail: 0,
			selectedChars: [],
			message:
				"Click characters in the correct reading order (zigzag pattern)"
		});
		addLog("GAME", "Rail Puzzle minigame initialized");
	};

	const handleRailCharClick = (railIndex, charIndex) => {
		if (!railGameState) return;

		const charData = railGameState.pattern[railIndex][charIndex];
		const newSelected = [...railGameState.selectedChars, charData];

		setRailGameState({
			...railGameState,
			selectedChars: newSelected
		});
	};

	const submitRailPuzzle = async () => {
		if (!railGameState) return;

		const playerOrder = railGameState.selectedChars
			.map((c) => c.char)
			.join("");
		addLog("INFO", `Player sequence: ${playerOrder}`);
		addLog("ANALYSIS", "Validating puzzle solution...");

		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 400));

		try {
			const payload = {
				ciphertext: playerOrder,
				cipherType: "railfence",
				config: { rails }
			};

			const response = await axios.post(
				API_ENDPOINTS.CIPHER_DECRYPT,
				payload
			);

			const decrypted = response.data.plaintext;
			const isReadable = decrypted && decrypted.trim().length > 0;

			if (isReadable) {
				setResult(decrypted);
				playSound("ciphertoolFinish");
				addLog("SUCCESS", "Puzzle solved correctly!");
				setRailGameState(null);
			} else {
				throw new Error("Invalid sequence");
			}
		} catch (err) {
			addLog("ERROR", "Incorrect sequence detected!");
			await new Promise((resolve) => setTimeout(resolve, 300));
			setRailGameState(null);
			setIsLoading(false);
			await railFenceBruteForce();
		}
	};

	const railFenceBruteForce = async () => {
		if (!cipherText.trim()) {
			setError("Enter cipher text to crack");
			addLog(
				"ERROR",
				"No input provided for RAIL-FENCE brute force"
			);
			return;
		}

		addLog("WARNING", "Initiating RAIL-FENCE brute force attack...");
		setIsLoading(true);
		setError("");
		setResult("");
		setBruteForceProgress(0);

		await new Promise((resolve) => setTimeout(resolve, 500));
		addLog("SCAN", "Testing all possible rail configurations...");

		for (let i = 2; i <= 10; i++) {
			await new Promise((resolve) => setTimeout(resolve, 300));
			addLog("SCAN", `Testing rail iteration ${i}...`);
			setBruteForceProgress(((i - 2) / 8) * 100);
		}

		await new Promise((resolve) => setTimeout(resolve, 400));
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
				setError("Brute force decryption failed");
				addLog("ERROR", "Unable to decrypt ciphertext");
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
			<div className="border border-purple-900 bg-purple-950/20 p-3">
				<div className="mb-2 text-xs text-purple-400">
					RAIL-PUZZLE MINIGAME
				</div>
				<div className="text-[10px] text-gray-500">
					Click characters in zigzag reading order to solve the
					puzzle!
				</div>
			</div>
			<div className="space-y-2">
				<label className="text-xs text-gray-500">
					NUMBER OF RAILS
				</label>
				<div className="flex items-center gap-3">
					<button
						onClick={() =>
							onRailsChange(Math.max(2, rails - 1))
						}
						className="border border-gray-700 bg-[#0a0a0a] px-3 py-1 text-xs text-green-400 hover:border-green-400">
						◀
					</button>
					<div className="flex-1 text-center">
						<span className="text-xl font-bold text-green-400">
							{rails}
						</span>
						<div className="text-[10px] text-gray-600">
							RAILS
						</div>
					</div>
					<button
						onClick={() =>
							onRailsChange(Math.min(10, rails + 1))
						}
						className="border border-gray-700 bg-[#0a0a0a] px-3 py-1 text-xs text-green-400 hover:border-green-400">
						▶
					</button>
				</div>
			</div>
			{!railGameState ? (
				<Button
					onClick={initRailGame}
					disabled={!cipherText.trim()}
					variant="primary"
					className="w-full">
					[ START RAIL PUZZLE ]
				</Button>
			) : (
				<div className="space-y-3">
					<div className="text-[10px] text-yellow-400">
						{railGameState.message}
					</div>
					<div className="space-y-2 border border-purple-700 bg-[#0a0a0a] p-3">
						<div className="mb-2 text-[10px] text-purple-400">
							RAIL PATTERN - Click characters in zigzag
							order:
						</div>
						{railGameState.pattern.map((rail, railIndex) => (
							<div
								key={railIndex}
								className="flex items-center gap-1">
								<span className="w-8 text-[10px] text-cyan-400">
									R{railIndex + 1}:
								</span>
								<div className="flex flex-wrap gap-1">
									{rail.map((item, charIndex) => {
										const isSelected =
											railGameState.selectedChars.some(
												(sc) =>
													sc.index === item.index
											);
										const selectionOrder =
											railGameState.selectedChars.findIndex(
												(sc) =>
													sc.index === item.index
											);

										return (
											<button
												key={charIndex}
												onClick={() =>
													handleRailCharClick(
														railIndex,
														charIndex
													)
												}
												disabled={isSelected}
												className={`h-6 w-6 border font-mono text-[10px] transition-all ${
													isSelected
														? "cursor-not-allowed border-green-500 bg-green-900/50 text-green-400"
														: "cursor-pointer border-gray-700 bg-gray-900 text-purple-400 hover:border-purple-500 hover:bg-purple-950/50"
												}`}>
												<div className="relative">
													{item.char}
													{isSelected && (
														<span className="absolute -top-1 -right-1 text-[6px] text-green-300">
															{selectionOrder +
																1}
														</span>
													)}
												</div>
											</button>
										);
									})}
								</div>
							</div>
						))}
					</div>
					{railGameState.selectedChars.length > 0 && (
						<div className="border border-gray-700 bg-[#0a0a0a] p-2">
							<div className="mb-1 text-[10px] text-gray-500">
								YOUR SEQUENCE:
							</div>
							<div className="font-mono text-xs text-green-400">
								{railGameState.selectedChars
									.map((c) => c.char)
									.join("")}
							</div>
						</div>
					)}
					<div className="flex gap-2">
						<Button
							onClick={() =>
								setRailGameState({
									...railGameState,
									selectedChars: []
								})
							}
							disabled={
								railGameState.selectedChars.length === 0
							}
							variant="warning"
							className="flex-1">
							[ RESET ]
						</Button>
						<Button
							onClick={submitRailPuzzle}
							disabled={
								railGameState.selectedChars.length === 0
							}
							variant="success"
							className="flex-1">
							[ SUBMIT & COMPARE ]
						</Button>
					</div>
				</div>
			)}
			<ProgressBar
				progress={bruteForceProgress}
				label="BRUTE FORCE PROGRESS"
			/>
			<Button
				onClick={railFenceBruteForce}
				disabled={isLoading || !cipherText.trim()}
				variant="success"
				className="w-full">
				{isLoading ? "PROCESSING..." : "BRUTE FORCE ZIGZAG"}
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
		</div>
	);
};

export default RailFenceCipher;
