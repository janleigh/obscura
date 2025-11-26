import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
	calculateFrequencies,
	CIPHER_DELAYS,
	generateRailFencePattern,
	getTopFrequentChars,
	POLYBIUS_GRID
} from "../../../../packages/shared/cipherUtils";
import { API_ENDPOINTS } from "../config/api";

const CipherTools = () => {
	const [cipherText, setCipherText] = useState("");
	const [key, setKey] = useState("");
	const [selectedCipher, setSelectedCipher] = useState("caesar");
	const [shift, setShift] = useState(3);
	const [rails, setRails] = useState(3);
	const [result, setResult] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [stegoImage, setStegoImage] = useState(null);
	const [stegoMessage, setStegoMessage] = useState("");
	const [logs, setLogs] = useState([]);
	const [bruteForceProgress, setBruteForceProgress] = useState(0);
	const [railGameState, setRailGameState] = useState(null);
	const [vigenereCrackState, setVigenereCrackState] = useState(null);
	const logEndRef = useRef(null);

	const ciphers = [
		{
			value: "caesar",
			label: "ROT-CRACK.BF"
		},
		{
			value: "vigenere",
			label: "KEYHUNT.VGE"
		},
		{
			value: "atbash",
			label: "MIRROR-FLIP.REV"
		},
		{
			value: "base64",
			label: "B64-DECODE.UTL"
		},
		{
			value: "polybius",
			label: "GRID-CRACK.DCDR"
		},
		{
			value: "railfence",
			label: "RAIL-PUZZLE.GME"
		},
		{
			value: "morse",
			label: "DOT-DASH-DECODER"
		},
		{
			value: "baconian",
			label: "BACON-PARSE.R"
		},
		{
			value: "steganography",
			label: "STEGO-SCANNER.LSB"
		}
	];

	// add log entry
	const addLog = (type, message) => {
		const timestamp = new Date().toLocaleTimeString();
		setLogs(
			(prev) => [...prev, { type, message, timestamp }].slice(-50) // keep last 50 logs
		);
	};

	// autoscroll to bottom of logs
	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [logs]);

	// init the toolkit
	useEffect(() => {
		addLog("INFO", "Cipher Toolkit v3.3.01 initialized");
		addLog("INFO", "9 cryptographic tools loaded successfully");
		addLog("INFO", "Awaiting user input...");
	}, []);

	// CAESAR BRUTE FORCE SIMULATION
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

		// setup delay
		await new Promise((resolve) => setTimeout(resolve, 300));
		addLog("SCAN", "Loading character set...");
		await new Promise((resolve) => setTimeout(resolve, 200));
		addLog("SCAN", "Initializing rotation vectors...");
		await new Promise((resolve) => setTimeout(resolve, 250));

		// simulate brute force through all 25 shifts
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

	// RAIL FENCE "MINIGAME"
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
			// First attempt to decrypt with player's solution
			const payload = {
				ciphertext: playerOrder,
				cipherType: "railfence",
				config: { rails }
			};

			const response = await axios.post(
				API_ENDPOINTS.CIPHER_DECRYPT,
				payload
			);

			// Check if the decryption produced readable text
			const decrypted = response.data.plaintext;
			const isReadable = decrypted && decrypted.trim().length > 0;

			if (isReadable) {
				setResult(decrypted);
				addLog("SUCCESS", "Puzzle solved correctly!");
				setRailGameState(null);
			} else {
				throw new Error("Invalid sequence");
			}
		} catch (err) {
			// Player got it wrong - fall back to brute force
			addLog("ERROR", "Incorrect sequence detected!");
			await new Promise((resolve) => setTimeout(resolve, 300));
			setRailGameState(null);
			setIsLoading(false);

			// Call the dedicated brute force function
			await railFenceBruteForce();
		}
	};

	// VIGENERE KEY ANALYZER
	const analyzeVigenereKey = async () => {
		if (!cipherText.trim()) {
			setError("Enter cipher text for key analysis");
			return;
		}

		addLog("INFO", "Starting KEYHUNT frequency analysis...");
		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 400));
		addLog("SCAN", "Parsing ciphertext...");

		await new Promise((resolve) => setTimeout(resolve, 500));
		addLog("ANALYSIS", "Computing character frequencies...");

		// Use shared frequency calculation utilities
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

		// Simulate brute force delay
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

	const handleDecrypt = async () => {
		if (!cipherText.trim() && selectedCipher !== "steganography") {
			setError("Enter cipher text to decrypt");
			setResult("");
			addLog("ERROR", "No input provided");
			return;
		}

		addLog(
			"INFO",
			`Starting ${ciphers.find((c) => c.value === selectedCipher)?.label || selectedCipher} operation...`
		);
		setIsLoading(true);
		setError("");
		setResult("");

		await new Promise((resolve) => setTimeout(resolve, 200));
		addLog("SCAN", "Loading cipher parameters...");

		try {
			const config = {};

			// build config based on cipher type
			if (selectedCipher === "caesar") {
				config.shift = shift;
				addLog("CONFIG", `Shift parameter: ${shift}`);
			} else if (selectedCipher === "vigenere") {
				if (!key.trim()) {
					setError("Key is required for Vigenère cipher");
					addLog("ERROR", "Missing key parameter");
					setIsLoading(false);
					return;
				}
				config.key = key;
				addLog("CONFIG", `Key length: ${key.length} characters`);
			} else if (selectedCipher === "railfence") {
				config.rails = rails;
				addLog("CONFIG", `Rails: ${rails}`);
			}

			const payload = {
				ciphertext: cipherText,
				cipherType: selectedCipher,
				config
			};

			await new Promise((resolve) =>
				setTimeout(resolve, CIPHER_DELAYS[selectedCipher] || 400)
			);
			addLog("DECODE", "Processing cipher algorithm...");

			await new Promise((resolve) => setTimeout(resolve, 300));
			addLog("NETWORK", "Sending decryption request to server...");

			const response = await axios.post(
				API_ENDPOINTS.CIPHER_DECRYPT,
				payload
			);

			await new Promise((resolve) => setTimeout(resolve, 250));
			addLog("DECODE", "Parsing server response...");

			// backend returns { plaintext, cipherType, encryptedLength, decryptedLength }
			if (response.data.plaintext !== undefined) {
				setResult(response.data.plaintext);
				addLog(
					"SUCCESS",
					`Decryption successful! ${response.data.decryptedLength} chars recovered`
				);
			} else if (response.data.error) {
				setError(response.data.error);
				addLog("ERROR", response.data.error);
			} else {
				setError("Decryption failed");
				addLog("ERROR", "Unknown decryption failure");
			}
		} catch (err) {
			console.error("Decryption error:", err);
			console.error("Error response:", err.response?.data);
			const errorMsg =
				err.response?.data?.message ||
				"Failed to decrypt. Check your input and try again.";
			setError(errorMsg);
			addLog("CRITICAL", errorMsg);
		} finally {
			setIsLoading(false);
		}
	};

	const showSteganography = selectedCipher === "steganography";

	// steno
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
				// extract LSB from RGB channels
				// just read outguess source code twin
				binary += (data[i] & 1).toString(); // R
				binary += (data[i + 1] & 1).toString(); // G
				binary += (data[i + 2] & 1).toString(); // B
			}

			addLog(
				"DECODE",
				`Extracted ${binary.length} bits, converting to ASCII...`
			);
			await new Promise((resolve) => setTimeout(resolve, 500));

			// bin to text
			let message = "";
			for (let i = 0; i < binary.length; i += 8) {
				const byte = binary.slice(i, i + 8);
				if (byte.length < 8) break;
				const charCode = parseInt(byte, 2);
				if (charCode === 0) break; // null terminator
				if (charCode < 32 || charCode > 126) continue; // non-printable
				message += String.fromCharCode(charCode);
			}

			if (message.trim()) {
				setStegoMessage(message);
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

	return (
		<div className="flex h-full gap-4">
			<div className="flex w-1/3 flex-col gap-4">
				{/* Header */}
				<div className="border border-cyan-400 bg-cyan-950/20 p-3">
					<div className="crt-glow flex items-center gap-2 text-sm font-bold text-cyan-400">
						<span>CIPHER TOOLKIT v3.3.01</span>
					</div>
					<div className="mt-1 text-xs text-gray-500">
						&copy; Copyright Cicada Foundation
					</div>
				</div>
				{/* Tool Selection */}
				<div className="scrollbar-thin flex-1 overflow-y-auto border border-gray-700 bg-black">
					<div className="border-b border-gray-800 bg-[#0a0a0a] px-3 py-2">
						<span className="text-xs font-bold text-green-400">
							SELECT TOOL
						</span>
					</div>
					<div className="space-y-1 p-2">
						{ciphers.map((cipher) => (
							<button
								key={cipher.value}
								onClick={() => {
									setSelectedCipher(cipher.value);
									addLog(
										"INFO",
										`Tool switched to ${cipher.label}`
									);
									setResult("");
									setError("");
									setRailGameState(null);
									setVigenereCrackState(null);
								}}
								className={`w-full border px-3 py-2 text-left text-xs transition-colors ${
									selectedCipher === cipher.value
										? "border-cyan-400 bg-cyan-950/30 text-cyan-400"
										: "border-gray-800 bg-[#0a0a0a] text-gray-400 hover:border-gray-600 hover:text-gray-300"
								}`}>
								<div className="flex items-center gap-2">
									<div className="flex-1">
										<div className="font-bold">
											{cipher.label}
										</div>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="flex flex-1 flex-col gap-4 overflow-hidden">
				<div className="flex flex-1 flex-col border border-gray-700 bg-black">
					<div className="flex items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-4 py-2">
						<span className="text-xs font-bold text-green-400">
							{ciphers
								.find((c) => c.value === selectedCipher)
								?.label.toUpperCase()}
						</span>
					</div>
					<div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
						{!showSteganography && (
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs text-gray-500">
									INPUT CIPHERTEXT
								</label>
								<textarea
									value={cipherText}
									onChange={(e) =>
										setCipherText(e.target.value)
									}
									placeholder="Paste encrypted text here..."
									className="scrollbar-thin h-32 w-full resize-none border border-gray-700 bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-green-400 outline-none focus:border-green-400"
								/>
							</div>
						)}
						{/* CAESAR */}
						{selectedCipher === "caesar" && (
							<div className="space-y-3">
								<div className="border border-yellow-900 bg-yellow-950/20 p-3">
									<div className="mb-2 text-xs text-yellow-400">
										ROT-CRACK [BRUTE FORCE]
									</div>
									<div className="text-[10px] text-gray-500">
										This tool will attempt all 25
										possible shift values to crack the
										Caesar cipher.
									</div>
								</div>
								<div className="space-y-2">
									<label className="text-xs text-gray-500">
										MANUAL SHIFT OVERRIDE
									</label>
									<div className="flex items-center gap-3">
										<button
											onClick={() =>
												setShift(
													Math.max(0, shift - 1)
												)
											}
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
											onClick={() =>
												setShift(
													Math.min(25, shift + 1)
												)
											}
											className="border border-gray-700 bg-[#0a0a0a] px-3 py-1 text-xs text-green-400 hover:border-green-400">
											▶
										</button>
									</div>
								</div>
								{bruteForceProgress > 0 && (
									<div className="space-y-1">
										<div className="text-[10px] text-gray-500">
											BRUTE FORCE PROGRESS
										</div>
										<div className="h-4 overflow-hidden border border-gray-700 bg-[#0a0a0a]">
											<div
												className="h-full bg-green-600 transition-all duration-100"
												style={{
													width: `${bruteForceProgress}%`
												}}
											/>
										</div>
									</div>
								)}
							</div>
						)}
						{/* VIGENERE */}
						{selectedCipher === "vigenere" && (
							<div className="space-y-3">
								<div className="border border-blue-900 bg-blue-950/20 p-3">
									<div className="mb-2 text-xs text-blue-400">
										KEYHUNT [VIGENERE ANALYZER]
									</div>
									<div className="text-[10px] text-gray-500">
										Frequency analysis tool to help
										identify potential key patterns.
									</div>
								</div>
								<div className="space-y-2">
									<label className="text-xs text-gray-500">
										DECRYPTION KEY
									</label>
									<input
										type="text"
										value={key}
										onChange={(e) =>
											setKey(
												e.target.value.toUpperCase()
											)
										}
										placeholder="Enter suspected key..."
										className="w-full border border-gray-700 bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-green-400 outline-none focus:border-green-400"
									/>
								</div>
								<button
									onClick={analyzeVigenereKey}
									disabled={!cipherText.trim()}
									className="w-full border border-blue-700 bg-blue-950/30 px-3 py-2 text-xs text-blue-400 transition-colors hover:bg-blue-900/30 disabled:opacity-50">
									[ RUN FREQUENCY ANALYSIS ]
								</button>
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
												{
													vigenereCrackState.mostCommon
												}
											</span>
										</div>
									</div>
								)}
							</div>
						)}

						{/* RAIL FENCE */}
						{selectedCipher === "railfence" && (
							<div className="space-y-3">
								<div className="border border-purple-900 bg-purple-950/20 p-3">
									<div className="mb-2 text-xs text-purple-400">
										RAIL-PUZZLE MINIGAME
									</div>
									<div className="text-[10px] text-gray-500">
										Click characters in zigzag reading
										order to solve the puzzle!
									</div>
								</div>
								<div className="space-y-2">
									<label className="text-xs text-gray-500">
										NUMBER OF RAILS
									</label>
									<div className="flex items-center gap-3">
										<button
											onClick={() =>
												setRails(
													Math.max(2, rails - 1)
												)
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
												setRails(
													Math.min(10, rails + 1)
												)
											}
											className="border border-gray-700 bg-[#0a0a0a] px-3 py-1 text-xs text-green-400 hover:border-green-400">
											▶
										</button>
									</div>
								</div>
								{!railGameState ? (
									<button
										onClick={initRailGame}
										disabled={!cipherText.trim()}
										className="w-full border border-purple-700 bg-purple-950/30 px-3 py-2 text-xs text-purple-400 transition-colors hover:bg-purple-900/30 disabled:opacity-50">
										[ START RAIL PUZZLE ]
									</button>
								) : (
									<div className="space-y-3">
										<div className="text-[10px] text-yellow-400">
											{railGameState.message}
										</div>
										{/* Interactive Rail Pattern Grid */}
										<div className="space-y-2 border border-purple-700 bg-[#0a0a0a] p-3">
											<div className="mb-2 text-[10px] text-purple-400">
												RAIL PATTERN - Click
												characters in zigzag order:
											</div>
											{railGameState.pattern.map(
												(rail, railIndex) => (
													<div
														key={railIndex}
														className="flex items-center gap-1">
														<span className="w-8 text-[10px] text-cyan-400">
															R
															{railIndex + 1}
															:
														</span>
														<div className="flex flex-wrap gap-1">
															{rail.map(
																(
																	item,
																	charIndex
																) => {
																	const isSelected =
																		railGameState.selectedChars.some(
																			(
																				sc
																			) =>
																				sc.index ===
																				item.index
																		);
																	const selectionOrder =
																		railGameState.selectedChars.findIndex(
																			(
																				sc
																			) =>
																				sc.index ===
																				item.index
																		);

																	return (
																		<button
																			key={
																				charIndex
																			}
																			onClick={() =>
																				handleRailCharClick(
																					railIndex,
																					charIndex
																				)
																			}
																			disabled={
																				isSelected
																			}
																			className={`h-6 w-6 border font-mono text-[10px] transition-all ${
																				isSelected
																					? "cursor-not-allowed border-green-500 bg-green-900/50 text-green-400"
																					: "cursor-pointer border-gray-700 bg-gray-900 text-purple-400 hover:border-purple-500 hover:bg-purple-950/50"
																			}`}>
																			<div className="relative">
																				{
																					item.char
																				}
																				{isSelected && (
																					<span className="absolute -top-1 -right-1 text-[6px] text-green-300">
																						{selectionOrder +
																							1}
																					</span>
																				)}
																			</div>
																		</button>
																	);
																}
															)}
														</div>
													</div>
												)
											)}
										</div>
										{/* Selected Sequence Display */}
										{railGameState.selectedChars
											.length > 0 && (
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
										{/* Control Buttons */}
										<div className="flex gap-2">
											<button
												onClick={() =>
													setRailGameState({
														...railGameState,
														selectedChars: []
													})
												}
												disabled={
													railGameState
														.selectedChars
														.length === 0
												}
												className="flex-1 border border-yellow-700 bg-yellow-950/30 px-3 py-2 text-xs text-yellow-400 hover:bg-yellow-900/30 disabled:cursor-not-allowed disabled:opacity-50">
												[ RESET ]
											</button>
											<button
												onClick={submitRailPuzzle}
												disabled={
													railGameState
														.selectedChars
														.length === 0
												}
												className="flex-1 border border-green-700 bg-green-950/30 px-3 py-2 text-xs text-green-400 hover:bg-green-900/30 disabled:cursor-not-allowed disabled:opacity-50">
												[ SUBMIT & COMPARE ]
											</button>
										</div>
									</div>
								)}
							</div>
						)}
						{/* POLYBIUS */}
						{selectedCipher === "polybius" && (
							<div className="space-y-3">
								<div className="border border-teal-900 bg-teal-950/20 p-3">
									<div className="mb-2 text-xs text-teal-400">
										GRID-CRACK DECODER
									</div>
									<div className="text-[10px] text-gray-500">
										Each letter is encoded as
										[row][column] coordinates.
									</div>
								</div>
								<div className="border border-gray-700 bg-[#0a0a0a] p-3">
									<div className="mb-2 flex gap-1">
										<div className="h-7 w-7" />
										{[1, 2, 3, 4, 5].map((col) => (
											<div
												key={col}
												className="flex h-7 w-7 items-center justify-center text-[10px] font-bold text-cyan-400">
												{col}
											</div>
										))}
									</div>
									{POLYBIUS_GRID.map((row, rowIndex) => (
										<div
											key={rowIndex}
											className="mb-1 flex gap-1">
											<div className="flex h-7 w-7 items-center justify-center text-[10px] font-bold text-cyan-400">
												{rowIndex + 1}
											</div>
											{row.map(
												(letter, colIndex) => (
													<div
														key={colIndex}
														className="flex h-7 w-7 items-center justify-center border border-gray-700 font-mono text-[10px] text-green-400 transition-colors hover:bg-gray-800">
														{letter}
													</div>
												)
											)}
										</div>
									))}
								</div>
							</div>
						)}
						{/* ATBASH */}
						{selectedCipher === "atbash" && (
							<div className="space-y-3">
								<div className="border border-indigo-900 bg-indigo-950/20 p-3">
									<div className="mb-2 text-xs text-indigo-400">
										MIRROR-FLIP REVERSER
									</div>
									<div className="text-[10px] text-gray-500">
										Ancient Hebrew cipher. A↔Z, B↔Y,
										C↔X... Perfect symmetry.
									</div>
								</div>
								<div className="border border-gray-700 bg-[#0a0a0a] p-2 font-mono text-[10px] text-gray-400">
									<div className="mb-1 text-cyan-400">
										MAPPING:
									</div>
									<div>A B C D E F G H I J K L M</div>
									<div className="text-gray-600">
										↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕
										↕
									</div>
									<div>Z Y X W V U T S R Q P O N</div>
								</div>
							</div>
						)}
						{/* BASE64 */}
						{selectedCipher === "base64" && (
							<div className="space-y-3">
								<div className="border border-orange-900 bg-orange-950/20 p-3">
									<div className="mb-2 text-xs text-orange-400">
										B64-DECODE UTLITY
									</div>
									<div className="text-[10px] text-gray-500">
										Standard Base64 decoder for data
										transmission encoding.
									</div>
								</div>
								<div className="space-y-1 text-[10px] text-gray-600">
									<div>
										• Converts binary data to ASCII
										text
									</div>
									<div>
										• Look for '=' padding at the end
									</div>
									<div>
										• Uses A-Z, a-z, 0-9, +, / alphabet
									</div>
								</div>
							</div>
						)}
						{/* MORSE CODE */}
						{selectedCipher === "morse" && (
							<div className="space-y-3">
								<div className="border border-amber-900 bg-amber-950/20 p-3">
									<div className="mb-2 text-xs text-amber-400">
										DOT-DASH DECODER
									</div>
									<div className="text-[10px] text-gray-500">
										International Morse Code
										translator. Dots, dashes, and
										spaces.
									</div>
								</div>
								<div className="space-y-1 border border-gray-700 bg-[#0a0a0a] p-2 font-mono text-[10px] text-gray-400">
									<div>
										<span className="text-cyan-400">
											A:
										</span>{" "}
										.-{" "}
										<span className="text-cyan-400">
											B:
										</span>{" "}
										-...{" "}
										<span className="text-cyan-400">
											C:
										</span>{" "}
										-.-.
									</div>
									<div>
										<span className="text-cyan-400">
											S:
										</span>{" "}
										...{" "}
										<span className="text-cyan-400">
											O:
										</span>{" "}
										---{" "}
										<span className="text-cyan-400">
											S:
										</span>{" "}
										...
									</div>
									<div className="mt-1 text-yellow-400">
										Spaces separate letters
									</div>
								</div>
							</div>
						)}
						{/* BACONIAN */}
						{selectedCipher === "baconian" && (
							<div className="space-y-3">
								<div className="border border-red-900 bg-red-950/20 p-3">
									<div className="mb-2 text-xs text-red-400">
										BACON-PARSE ANALYZER
									</div>
									<div className="text-[10px] text-gray-500">
										Binary steganography using A/B
										patterns (Francis Bacon's cipher).
									</div>
								</div>
								<div className="border border-gray-700 bg-[#0a0a0a] p-2 font-mono text-[10px] text-gray-400">
									<div className="mb-1 text-cyan-400">
										5-BIT ENCODING:
									</div>
									<div>
										<span className="text-green-400">
											A
										</span>{" "}
										= AAAAA
									</div>
									<div>
										<span className="text-green-400">
											B
										</span>{" "}
										= AAAAB
									</div>
									<div>
										<span className="text-green-400">
											C
										</span>{" "}
										= AAABA
									</div>
									<div className="mt-1 text-yellow-400">
										Can hide in any A/B pattern!
									</div>
								</div>
							</div>
						)}
						{/* STEGANOGRAPHY - Image Scanner */}
						{selectedCipher === "steganography" && (
							<div className="space-y-3">
								<div className="border border-pink-900 bg-pink-950/20 p-3">
									<div className="mb-2 text-xs text-pink-400">
										STEGO-SCANNER (LSB)
									</div>
									<div className="text-[10px] text-gray-500">
										Extract hidden messages from image
										LSB channels.
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
													imageRendering:
														"pixelated"
												}}
											/>
										</div>
										<div className="text-[10px] text-gray-600">
											Ready for LSB extraction from
											RGB channels
										</div>
									</div>
								)}
							</div>
						)}
						{/* Execute Button */}
						<div className="pt-2">
							<button
								onClick={
									selectedCipher === "caesar"
										? caesarBruteForce
										: selectedCipher === "railfence"
											? railFenceBruteForce
											: selectedCipher === "steganography"
												? decodeSteganography
												: handleDecrypt
								}
								disabled={
									isLoading ||
									(selectedCipher === "steganography" &&
										!stegoImage) ||
									(!selectedCipher === "steganography" &&
										!cipherText.trim())
								}
								className="w-full border border-green-700 bg-green-950/30 px-4 py-3 text-xs font-bold text-green-400 transition-colors hover:bg-green-900/30 disabled:cursor-not-allowed disabled:opacity-50">
								{isLoading
									? "PROCESSING..."
									: selectedCipher === "caesar"
										? "INITIATE BRUTE FORCE"
										: selectedCipher === "steganography"
											? "SCAN IMAGE"
											: selectedCipher === "railfence"
												? "BRUTE FORCE ZIGZAG"
												: "EXECUTE DECRYPT"}
							</button>
						</div>
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
						{(result || stegoMessage) && (
							<div className="space-y-2 border border-green-700 bg-green-950/20 p-3">
								<div className="flex items-center gap-2 text-xs font-bold text-green-400">
									DECRYPTION SUCCESSFUL
								</div>
								<div className="border border-gray-700 bg-[#0a0a0a] p-3">
									<div className="font-mono text-xs break-all text-green-400">
										{result || stegoMessage}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				{/* LOGGER */}
				<div className="h-48 border border-gray-700 bg-black">
					<div className="flex items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-4 py-2">
						<span className="text-xs font-bold text-green-400">
							ACTIVITY LOG
						</span>
						<button
							onClick={() => setLogs([])}
							className="text-[10px] text-gray-600 hover:text-gray-400">
							[CLEAR]
						</button>
					</div>
					<div className="scrollbar-thin font-kode-mono h-[calc(100%-2.5rem)] space-y-1 overflow-y-auto p-2 text-[10px]">
						{logs.length === 0 ? (
							<div className="py-4 text-center text-gray-600">
								No activity yet. Select a tool to begin.
							</div>
						) : (
							<>
								{logs.map((log, idx) => (
									<div key={idx} className="flex gap-2">
										<span className="text-gray-600">
											[{log.timestamp}]
										</span>
										{/* I love ternary */}
										<span
											className={
												log.type === "ERROR" ||
												log.type === "CRITICAL"
													? "text-red-400"
													: log.type === "SUCCESS"
														? "text-green-400"
														: log.type === "WARNING"
															? "text-yellow-400"
															: log.type === "INFO" || log.type === "CONFIG"
																? "text-cyan-400"
																: log.type === "SCAN" || log.type === "ANALYSIS" || log.type === "DECODE"
																	? "text-blue-400"
																	: log.type === "GAME"
																		? "text-purple-400"
																		: "text-gray-400"
											}>
											[{log.type}]
										</span>
										<span className="text-gray-300">
											{log.message}
										</span>
									</div>
								))}
								<div ref={logEndRef} />
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CipherTools;
