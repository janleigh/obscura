import axios from "axios";
import { useEffect, useState } from "react";
import { getLevelById } from "../../../../packages/shared/levels";
import { API_ENDPOINTS } from "../config/api";
import CipherTools from "./CipherTools";
import PhaseKeys from "./PhaseKeys";
import Terminal from "./Terminal";

const MainGame = ({ userData, currentLevel, onUserDataUpdate }) => {
	const [activeTab, setActiveTab] = useState("solver");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState(null);
	const [notes, setNotes] = useState("");
	const [showTutorial, setShowTutorial] = useState(true);

	const level = getLevelById(currentLevel);

	// ESC to close tutorial
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && showTutorial) {
				setShowTutorial(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [showTutorial]);

	if (!level) {
		return (
			<div className="text-center text-red-400">
				<p>Error: Level {currentLevel} not found</p>
			</div>
		);
	}

	// submit le answer
	const handleSubmit = async (answer) => {
		if (!answer.trim() || isSubmitting) return;

		console.log("Submit attempt - userData:", userData);
		console.log("Submit attempt - userId:", userData?.userId);

		if (!userData?.userId) {
			setMessage({
				type: "error",
				text: "Error: User session invalid. Please refresh the page."
			});
			return;
		}

		setIsSubmitting(true);
		setMessage(null);

		try {
			console.log(
				"Submitting to:",
				API_ENDPOINTS.LEVEL_SUBMIT(currentLevel)
			);
			console.log("Payload:", {
				userId: userData.userId,
				answer: answer.trim()
			});

			const response = await axios.post(
				API_ENDPOINTS.LEVEL_SUBMIT(currentLevel),
				{
					userId: userData.userId,
					answer: answer.trim()
				}
			);

			const { correct, storyFragment, transmission, nextLevelId } =
				response.data;

			if (correct) {
				setMessage({
					type: "success",
					text: "✓ CIPHER DECRYPTED!"
				});

				// show story fragment before proceeding
				if (storyFragment) {
					setTimeout(() => {
						setMessage({
							type: "story",
							text: storyFragment,
							transmission: transmission?.message
						});
					}, 1500);
				}

				if (onUserDataUpdate) {
					onUserDataUpdate({
						...userData,
						currentLevel: nextLevelId,
						completedLevels: [
							...(userData.completedLevels || []),
							currentLevel
						]
					});
				}

				// clear for the next level
				setTimeout(() => {
					setMessage(null);
					setNotes("");
				}, 5000);
			} else {
				setMessage({
					type: "error",
					text: "✗ INCORRECT. Try again."
				});
			}
		} catch (error) {
			console.error("Failed to submit answer:", error);
			setMessage({
				type: "error",
				text:
					error.response?.data?.error ||
					"Failed to submit answer"
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex h-full flex-col">
			{/* Tutorial Overlay */}
			{showTutorial && currentLevel === 0 && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-8">
					<div className="crt-glow max-w-2xl space-y-6 border border-cyan-400 bg-[#0a0a0a] p-8">
						<div className="text-xl font-bold text-cyan-400">
							# INTERFACE TUTORIAL
						</div>
						<div className="space-y-4 text-sm text-gray-300">
							<div className="border-l-2 border-cyan-400 pl-4">
								<div className="mb-1 font-bold text-cyan-400">
									NAVIGATION
								</div>
								<div className="space-y-1 text-xs text-gray-400">
									<div>
										•{" "}
										<span className="text-white">
											SOLVER
										</span>{" "}
										- Main puzzle interface with cipher
										text and terminal
									</div>
									<div>
										•{" "}
										<span className="text-white">
											PHASE KEYS
										</span>{" "}
										- Unlock special keys to access
										hidden content
									</div>
									<div>
										•{" "}
										<span className="text-white">
											CIPHER TOOLS
										</span>{" "}
										- Test and decrypt ciphers with
										various algorithms
									</div>
								</div>
							</div>
							<div className="border-l-2 border-yellow-300 pl-4">
								<div className="mb-1 font-bold text-yellow-300">
									HOW TO PLAY
								</div>
								<div className="space-y-1 text-xs text-gray-400">
									<div>
										1. Read the encrypted{" "}
										<span className="text-green-400">
											cipher text
										</span>{" "}
										and{" "}
										<span className="text-cyan-400">
											hint
										</span>
									</div>
									<div>
										2. Use the{" "}
										<span className="text-white">
											NOTEBOOK
										</span>{" "}
										to work out your solution
									</div>
									<div>
										3. Type your answer in the{" "}
										<span className="text-green-400">
											TERMINAL
										</span>{" "}
										and press ENTER
									</div>
									<div>
										4. Correct answers unlock{" "}
										<span className="text-cyan-400">
											story fragments
										</span>{" "}
										and progress
									</div>
								</div>
							</div>
							<div className="border-l-2 border-green-400 pl-4">
								<div className="mb-1 font-bold text-green-400">
									TIPS
								</div>
								<div className="space-y-1 text-xs text-gray-400">
									<div>
										• Use{" "}
										<span className="text-white">
											CIPHER TOOLKIT
										</span>{" "}
										to test decryption methods
									</div>
									<div>
										• Pay attention to hints - they
										reveal the cipher type
									</div>
									<div>
										• Your progress is automatically
										saved
									</div>
								</div>
							</div>
						</div>
						<div className="pt-4 text-center">
							<button
								onClick={() => setShowTutorial(false)}
								className="border border-cyan-400 bg-cyan-950/30 px-6 py-2 text-sm text-cyan-400 transition-colors hover:bg-cyan-900/30">
								[ BEGIN CALIBRATION ]
							</button>
						</div>
						<div className="text-center text-xs text-gray-600">
							Press ESC anytime to close this tutorial
						</div>
					</div>
				</div>
			)}
			{/* Tab Navigation */}
			<div className="flex gap-2 border-b border-gray-800">
				<button
					onClick={() => setActiveTab("solver")}
					className={`px-6 py-3 text-sm transition-colors ${
						activeTab === "solver"
							? "border-b-2 border-cyan-400 text-cyan-400"
							: "text-gray-500 hover:text-gray-400"
					}`}>
					SOLVER
				</button>
				<button
					onClick={() => setActiveTab("phasekeys")}
					className={`px-6 py-3 text-sm transition-colors ${
						activeTab === "phasekeys"
							? "border-b-2 border-cyan-400 text-cyan-400"
							: "text-gray-500 hover:text-gray-400"
					}`}>
					PHASE KEYS
				</button>
				<button
					onClick={() => setActiveTab("ciphertools")}
					className={`px-6 py-3 text-sm transition-colors ${
						activeTab === "ciphertools"
							? "border-b-2 border-cyan-400 text-cyan-400"
							: "text-gray-500 hover:text-gray-400"
					}`}>
					CIPHER TOOLKIT
				</button>
				<button
					onClick={() => setShowTutorial(true)}
					className="ml-auto px-6 py-3 text-sm text-gray-600 transition-colors hover:text-cyan-400"
					title="Show tutorial">
					?
				</button>
			</div>
			{/* Solver Tab */}
			{activeTab === "solver" && (
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="grid min-h-[400px] grid-cols-2 gap-4">
						<div className="flex min-h-[400px] flex-col border border-gray-800 bg-black">
							<div className="shrink-0 border-b border-gray-800 bg-[#0a0a0a] px-4 py-2">
								<span className="text-xs font-bold tracking-wider text-green-400">
									what do you call this again?
								</span>
							</div>
							<div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4">
								<div className="space-y-4">
									<div className="space-y-1 text-sm text-cyan-400">
										<div># {level.title}</div>
									</div>
									{level.transmission && (
										<div className="border-l-2 border-gray-800 pl-3">
											{level.transmission.type ===
												"image" &&
											level.transmission.imageUrl ? (
												<div className="space-y-2">
													<p className="text-xs text-gray-600">
														{
															level
																.transmission
																.message
														}
													</p>
													<img
														src={
															level
																.transmission
																.imageUrl
														}
														alt="Encrypted transmission"
														className="crt-glow h-auto max-w-full rounded border border-gray-800"
														style={{
															maxHeight:
																"300px",
															imageRendering:
																"pixelated"
														}}
													/>
													<p className="text-xs text-yellow-600">
														Right-click → Save
														image to analyze
														offline
													</p>
												</div>
											) : (
												<p className="text-xs text-gray-600">
													{
														level.transmission
															.message
													}
												</p>
											)}
										</div>
									)}
									<div className="border border-gray-700 bg-[#0a0a0a] p-3">
										<div className="font-mono text-sm break-all text-green-400">
											{level.cipherText}
										</div>
									</div>
									<div className="border-t border-gray-800 pt-4">
										<div className="space-y-4">
											<div className="space-y-3 border-gray-800">
												<div className="space-y-1 text-sm text-cyan-400">
													<div># HINT</div>
												</div>
												<div className="relative p-3 font-mono text-xs text-gray-400 italic">
													<div className="absolute top-2 left-2 text-lg text-gray-600">
														“
													</div>
													<div className="px-6 py-2 text-center text-sm">
														{level.hintPoem}
													</div>
													<div className="absolute right-2 bottom-2 text-lg text-gray-600">
														”
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="flex min-h-[300px] flex-col border border-gray-800 bg-black">
							<div className="shrink-0 border-b border-gray-800 bg-[#0a0a0a] px-4 py-2">
								<span className="text-xs font-bold tracking-wider text-green-400">
									NOTEBOOK
								</span>
							</div>
							<div className="min-h-0 flex-1 overflow-hidden p-2">
								<textarea
									value={notes}
									onChange={(e) =>
										setNotes(e.target.value)
									}
									placeholder="Insert your notes here..."
									className="scrollbar-thin h-full w-full resize-none border-none bg-transparent font-mono text-xs text-gray-400 outline-none"
								/>
							</div>
						</div>
					</div>
					{/* Terminal Input & Messages */}
					<div className="h-32 shrink-0 border border-gray-800 bg-black">
						<Terminal
							onSubmit={handleSubmit}
							isProcessing={isSubmitting}
						/>
					</div>
					{message && (
						<div className="shrink-0">
							<div
								className={`border p-3 text-sm ${
									message.type === "success"
										? "border-green-700 bg-green-950/30 text-green-400"
										: message.type === "story"
											? "border-cyan-700 bg-cyan-950/30 text-cyan-300"
											: "border-red-700 bg-red-950/30 text-red-400"
								}`}>
								{message.type === "story" ? (
									<div className="space-y-2">
										{message.transmission && (
											<div className="mb-2 text-xs text-gray-500">
												{message.transmission}
											</div>
										)}
										<div className="whitespace-pre-wrap">
											{message.text}
										</div>
									</div>
								) : (
									message.text
								)}
							</div>
						</div>
					)}
				</div>
			)}
			{activeTab === "phasekeys" && (
				<div className="flex-1 overflow-hidden">
					<PhaseKeys />
				</div>
			)}
			{activeTab === "ciphertools" && (
				<div className="flex-1 p-4">
					<CipherTools />
				</div>
			)}
		</div>
	);
};

export default MainGame;
