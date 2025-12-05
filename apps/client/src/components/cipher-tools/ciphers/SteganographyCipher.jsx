import { useState } from "react";
import { useSound } from "../../../hooks/useSound";
import Button from "../../shared/Button";

const SteganographyCipher = ({ addLog }) => {
	const [stegoImage, setStegoImage] = useState(null);
	const [stegoMessage, setStegoMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
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

	const decodeSteganography = async () => {
		if (!stegoImage) {
			setError("Please upload an image first");
			addLog("ERROR", "No image loaded for STEGO-SCANNER");
			return;
		}

		addLog("INFO", "Initializing LSB extraction scan...");
		setIsLoading(true);

		const img = new Image();
		img.onload = async () => {
			addLog("SCAN", "Image loaded, extracting pixel data...");
			await new Promise((resolve) => setTimeout(resolve, 600));

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
			<div className="border border-pink-900 bg-pink-950/20 p-3">
				<div className="mb-2 text-xs text-pink-400">
					STEGO-SCANNER (LSB)
				</div>
				<div className="text-[10px] text-gray-500">
					Extract hidden messages from image LSB channels.
				</div>
			</div>
			<div className="space-y-2">
				<label className="text-xs text-gray-500">
					UPLOAD TARGET IMAGE
				</label>
				<input
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
					className="w-full border border-gray-700 bg-[#0a0a0a] px-2 py-2 text-xs text-green-400 outline-none file:mr-2 file:cursor-pointer file:border file:border-gray-700 file:bg-gray-900 file:px-3 file:py-1 file:text-xs file:text-green-400 hover:file:bg-gray-800 focus:border-green-400"
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
					<div className="text-[10px] text-gray-600">
						Ready for LSB extraction from RGB channels
					</div>
				</div>
			)}
			<Button
				onClick={decodeSteganography}
				disabled={isLoading || !stegoImage}
				variant="primary"
				className="w-full">
				{isLoading ? "PROCESSING..." : "SCAN IMAGE"}
			</Button>
			{error && (
				<div className="border border-red-700 bg-red-950/30 p-3 text-xs text-red-300">
					{error}
				</div>
			)}
			{stegoMessage && (
				<div className="border border-green-700 bg-green-950/20 p-3">
					<div className="mb-2 text-xs font-bold text-green-400">
						DECRYPTION SUCCESSFUL
					</div>
					<div className="border border-gray-700 bg-[#0a0a0a] p-3 font-mono text-xs break-all text-green-400">
						{stegoMessage}
					</div>
				</div>
			)}
		</div>
	);
};

export default SteganographyCipher;
