import { useEffect, useState } from "react";
import { CIPHERS_CONFIG } from "../../../../../packages/shared/cipherUtils";
import { useActivityLog } from "../../hooks/useActivityLog";
import { useCipherOperations } from "../../hooks/useCipherOperations";
import Button from "../shared/Button";
import ActivityLogger from "./ActivityLogger";
import CipherInputForm from "./CipherInputForm";
import CipherToolList from "./CipherToolList";
import * as Ciphers from "./ciphers";
import { MemoryGame, NodeGame, VAPEGame, ZoneWallGame } from "./minigames";

const CipherTools = () => {
	const [cipherText, setCipherText] = useState("");
	const [key, setKey] = useState("");
	const [selectedCipher, setSelectedCipher] = useState("caesar");
	const [rails, setRails] = useState(3);
	const [showMinigame, setShowMinigame] = useState(false);
	const [minigameType, setMinigameType] = useState(null);

	const { logs, addLog, clearLogs, logEndRef } = useActivityLog(50);
	const { isLoading, result, error, decrypt, clearResults } =
		useCipherOperations(addLog);

	// Initialize toolkit
	useEffect(() => {
		addLog("INFO", "Cipher Toolkit v3.3.01 initialized");
		addLog("INFO", "9 cryptographic tools loaded successfully");
		addLog("INFO", "Awaiting user input...");
	}, [addLog]);

	const handleCipherSelect = (cipherValue) => {
		setSelectedCipher(cipherValue);
		addLog(
			"INFO",
			`Tool switched to ${CIPHERS_CONFIG.find((c) => c.value === cipherValue)?.label}`
		);
		clearResults();
	};

	const handleDecrypt = async () => {
		const config = {};

		if (
			selectedCipher === "caesar" ||
			selectedCipher === "railfence"
		) {
			return;
		} else if (selectedCipher === "vigenere") {
			if (!key.trim()) {
				addLog("ERROR", "Missing key parameter");
				return;
			}
			config.key = key;
			addLog("CONFIG", `Key length: ${key.length} characters`);
		}

		// Launch minigame before decryption
		addLog("INFO", "Launching two-factor authentication...");
		const games = ["vape", "zonewall", "memory", "node"];
		const selectedGame =
			games[Math.floor(Math.random() * games.length)];
		setMinigameType(
			selectedCipher === "vigenere" ? "memory" : selectedGame
		);
		setShowMinigame(true);
	};

	const handleMinigameSuccess = async () => {
		setShowMinigame(false);
		addLog(
			"SUCCESS",
			"Verification completed - Initiating decryption..."
		);

		const config = {};
		if (selectedCipher === "vigenere") {
			config.key = key;
		}

		await decrypt(cipherText, selectedCipher, config);
	};

	const handleMinigameCancel = () => {
		setShowMinigame(false);
		setMinigameType(null);
		addLog("INFO", "Verification aborted");
	};

	const handleMinigameFailure = () => {
		setShowMinigame(false);
		setMinigameType(null);
		addLog("WARN", "Verification failed - Adding security delay...");
	};

	const showSteganography = selectedCipher === "steganography";
	const showStandardInput =
		!showSteganography &&
		selectedCipher !== "caesar" &&
		selectedCipher !== "railfence";

	const selectedCipherLabel =
		CIPHERS_CONFIG.find((c) => c.value === selectedCipher)?.label ||
		selectedCipher;

	return (
		<div className="flex h-full gap-4">
			<CipherToolList
				ciphers={CIPHERS_CONFIG}
				selectedCipher={selectedCipher}
				onSelect={handleCipherSelect}
			/>
			<div className="flex flex-1 flex-col gap-4 overflow-hidden">
				<div className="flex flex-1 flex-col border border-gray-700 bg-black">
					<div className="flex items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-4 py-2">
						<span className="text-xs font-bold text-green-400">
							{selectedCipherLabel.toUpperCase()}
						</span>
					</div>
					<div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
						<>
							{/* Caesar Cipher */}
							{selectedCipher === "caesar" && (
								<Ciphers.CaesarCipher
									cipherText={cipherText}
									onCipherTextChange={setCipherText}
									addLog={addLog}
								/>
							)}
							{/* Vigenere Cipher */}
							{selectedCipher === "vigenere" && (
								<Ciphers.VigenereCipher
									cipherText={cipherText}
									keyValue={key}
									onKeyChange={setKey}
									addLog={addLog}
								/>
							)}
							{/* Rail Fence Cipher */}
							{selectedCipher === "railfence" && (
								<Ciphers.RailFenceCipher
									cipherText={cipherText}
									onCipherTextChange={setCipherText}
									rails={rails}
									onRailsChange={setRails}
									addLog={addLog}
								/>
							)}
							{/* Polybius Cipher */}
							{selectedCipher === "polybius" && (
								<Ciphers.PolybiusCipher />
							)}
							{/* Atbash Cipher */}
							{selectedCipher === "atbash" && (
								<Ciphers.AtbashCipher />
							)}
							{/* Base64 Cipher */}
							{selectedCipher === "base64" && (
								<Ciphers.Base64Cipher />
							)}
							{/* Morse Cipher */}
							{selectedCipher === "morse" && (
								<Ciphers.MorseCipher />
							)}
							{/* Baconian Cipher */}
							{selectedCipher === "baconian" && (
								<Ciphers.BaconianCipher />
							)}
							{/* Steganography */}
							{selectedCipher === "steganography" && (
								<Ciphers.SteganographyCipher
									addLog={addLog}
								/>
							)}
						</>
						{showStandardInput && (
							<CipherInputForm
								value={cipherText}
								onChange={setCipherText}
							/>
						)}
						{/* Execute Button for standard ciphers */}
						{showStandardInput && (
							<div className="pt-2">
								<Button
									onClick={handleDecrypt}
									disabled={
										isLoading || !cipherText.trim()
									}
									variant="success"
									className="w-full font-bold">
									{isLoading
										? "PROCESSING..."
										: "EXECUTE DECRYPT"}
								</Button>
							</div>
						)}
						{/* Minigame Modals */}
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
						{showMinigame && minigameType === "memory" && (
							<MemoryGame
								onSuccess={handleMinigameSuccess}
								onCancel={handleMinigameCancel}
								onFailure={handleMinigameFailure}
							/>
						)}
						{showMinigame && minigameType === "node" && (
							<NodeGame
								onSuccess={handleMinigameSuccess}
								onCancel={handleMinigameCancel}
								onFailure={handleMinigameFailure}
							/>
						)}
						{/* Results Display */}
						{error && (
							<div className="border border-red-700 bg-red-950/30 p-3">
								<div className="mb-1 text-xs font-bold text-red-400">
									ERROR
								</div>
								<div className="text-xs text-red-300">
									{error}
								</div>
							</div>
						)}
						{result && (
							<div className="space-y-2 border border-green-700 bg-green-950/20 p-3">
								<div className="flex items-center gap-2 text-xs font-bold text-green-400">
									DECRYPTION SUCCESSFUL
								</div>
								<div className="border border-gray-700 bg-[#0a0a0a] p-3">
									<div className="font-mono text-xs break-all text-green-400">
										{result}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<ActivityLogger
					logs={logs}
					logEndRef={logEndRef}
					onClear={clearLogs}
				/>
			</div>
		</div>
	);
};

export default CipherTools;
