import { useState } from "react";
import { useSound } from "../../../hooks/useSound";
import Button from "../../shared/Button";
import { VAPEGame, ZoneWallGame } from "../minigames";

const SteganographyCipher = ({ addLog }) => {
	const [stegoImage, setStegoImage] = useState(null);
	const [stegoMessage, setStegoMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showMinigame, setShowMinigame] = useState(false);
	const [minigameType, setMinigameType] = useState(null);
	const [delay, setDelay] = useState(0);
	const { playSound } = useSound();

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				setError("Please upload a valid image file");
				addLog("ERROR", "Invalid file type");
				return;
			}
			addLog(
				"INFO",
				`Image uploaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
			);
			const reader = new FileReader();
			reader.onload = async (event) => {
				addLog("SCAN", "Validating image format...");
				await new Promise((resolve) => setTimeout(resolve, 200));
				setStegoImage(event.target.result);
				setStegoMessage("");
				setError("");
				addLog("SUCCESS", "Image loaded and ready for analysis");
			};
			reader.readAsDataURL(file);
		}
	};

	const initiateScan = () => {
		if (!stegoImage) {
			setError("Please upload an image first");
			addLog("ERROR", "No image loaded for STEGO-SCANNER");
			return;
		}

		setError("");
		setDelay(0);
		setStegoMessage("");
		addLog("INFO", "Launching two-factor authentication...");
		const games = ["vape", "zonewall"];
		const selectedGame =
			games[Math.floor(Math.random() * games.length)];
		setMinigameType(selectedGame);
		setShowMinigame(true);
	};

	const handleMinigameFailure = () => {
		setShowMinigame(false);
		addLog("WARN", "Verification failed - Adding security delay...");
		const punishmentDelay = 300;
		setDelay(punishmentDelay);
		handleMinigameSuccess(undefined, punishmentDelay);
	};

	const handleMinigameSuccess = async (showSuccess, additionalDelay = 0) => {
		setShowMinigame(false);

		if (showSuccess === true) {
			addLog(
				"SUCCESS",
				"Verification completed - Initializing LSB extraction..."
			);
		}

		setIsLoading(true);

		const img = new Image();
		img.onload = async () => {
			addLog("SCAN", "Image loaded, extracting pixel data...");
			await new Promise((resolve) =>
				setTimeout(resolve, 600 + additionalDelay)
			);

			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			const imageData = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);
			const data = imageData.data;

			addLog("ANALYSIS", `Scanning ${data.length / 4} pixels...`);
			await new Promise((resolve) => setTimeout(resolve, 800));

			let binary = "";
			for (let i = 0; i < data.length; i += 4) {
				binary += (data[i] & 1).toString(); // R
				binary += (data[i + 1] & 1).toString(); // G
				binary += (data[i + 2] & 1).toString(); // B
			}

			addLog(
				"DECODE",
				`Extracted ${binary.length} bits, converting to ASCII...`
			);
			await new Promise((resolve) => setTimeout(resolve, 500));

			let message = "";
			for (let i = 0; i < binary.length; i += 8) {
				const byte = binary.slice(i, i + 8);
				if (byte.length < 8) break;
				const charCode = parseInt(byte, 2);
				if (charCode === 0) break;
				if (charCode < 32 || charCode > 126) continue;
				message += String.fromCharCode(charCode);
			}

			if (message.trim()) {
				setStegoMessage(message);
				playSound("ciphertoolFinish");
				setError("");
				addLog(
					"SUCCESS",
					`Hidden message found: ${message.length} characters`
				);
			} else {
				setStegoMessage("");
				setError("No hidden message found in image");
				addLog(
					"WARNING",
					"No valid message detected in LSB channels"
				);
			}
			setIsLoading(false);
		};

		img.onerror = () => {
			setError("Failed to load image");
			addLog("CRITICAL", "Image loading failed");
			setIsLoading(false);
		};

		img.src = stegoImage;
	};

	return (
		<div className="space-y-3">
			<div className="border-l-2 border-pink-500 bg-pink-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-pink-400">
						STEGO-SCANNER MODULE
					</div>
					<div className="text-[10px] text-pink-600">v5.0.2</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					LSB extraction tool for image steganography.
				</div>
			</div>
			<div className="space-y-2 border border-gray-800 bg-black/40 p-3">
				<label className="text-[10px] text-gray-500">
					TARGET IMAGE UPLOAD
				</label>
				<input
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
					className="w-full border border-gray-700 bg-[#0a0a0a] px-2 py-2 text-xs text-green-400 outline-none file:mr-2 file:cursor-pointer file:border file:border-gray-700 file:bg-gray-900 file:px-3 file:py-1 file:text-xs file:text-green-400 file:transition-colors hover:file:bg-gray-800 focus:border-green-400"
				/>
			</div>
			{stegoImage && (
				<div className="space-y-2">
					<div className="border border-gray-700 bg-[#0a0a0a] p-2">
						<img
							src={stegoImage}
							alt="Scan target"
							className="h-auto max-w-full"
							style={{
								maxHeight: "200px",
								imageRendering: "pixelated"
							}}
						/>
					</div>
					<div className="flex items-center gap-2 text-[10px] text-gray-600">
						<span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
						Ready for LSB extraction from RGB channels
					</div>
				</div>
			)}
			<Button
				onClick={initiateScan}
				disabled={isLoading || !stegoImage}
				variant="primary"
				className="w-full font-bold">
				{isLoading ? "PROCESSING..." : "SCAN IMAGE"}
			</Button>
			{/* Minigame Modal */}
			{showMinigame && minigameType === "vape" && (
				<VAPEGame
					onSuccess={handleMinigameSuccess}
					onCancel={() => {
						setShowMinigame(false);
						setMinigameType(null);
						addLog("INFO", "Verification aborted");
					}}
					onFailure={handleMinigameFailure}
				/>
			)}
			{showMinigame && minigameType === "zonewall" && (
				<ZoneWallGame
					onSuccess={handleMinigameSuccess}
					onCancel={() => {
						setShowMinigame(false);
						setMinigameType(null);
						addLog("INFO", "Verification aborted");
					}}
					onFailure={handleMinigameFailure}
				/>
			)}
			{error && (
				<div className="border border-red-700 bg-red-950/30 p-3 text-xs text-red-300">
					{error}
				</div>
			)}
			{stegoMessage && (
				<div className="animate-in fade-in border border-green-700 bg-green-950/20 p-3 duration-500">
					<div className="mb-2 flex items-center justify-between">
						<div className="text-xs font-bold text-green-400">
							EXTRACTION SUCCESSFUL
						</div>
						<button
							onClick={() => {
								navigator.clipboard.writeText(
									stegoMessage
								);
								addLog(
									"SUCCESS",
									"Result copied to clipboard"
								);
							}}
							className="text-[10px] font-bold text-green-600 hover:text-green-400">
							[COPY RESULT]
						</button>
					</div>
					<div className="border border-gray-700 bg-[#0a0a0a] p-3">
						<div className="font-mono text-xs break-all text-green-400">
							{stegoMessage}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SteganographyCipher;
