import Button from "../shared/Button";

const TutorialOverlay = ({ onClose }) => {
	return (
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
								<span className="text-white">SOLVER</span>{" "}
								- Main puzzle interface with cipher text
								and terminal
							</div>
							<div>
								•{" "}
								<span className="text-white">
									PHASE KEYS
								</span>{" "}
								- Unlock special keys to access hidden
								content
							</div>
							<div>
								•{" "}
								<span className="text-white">
									CIPHER TOOLS
								</span>{" "}
								- Test and decrypt ciphers with various
								algorithms
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
								<span className="text-cyan-400">hint</span>
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
								• Pay attention to hints - they reveal the
								cipher type
							</div>
							<div>
								• Your progress is automatically saved
							</div>
						</div>
					</div>
				</div>
				<div className="pt-4 text-center">
					<Button
						onClick={onClose}
						variant="primary"
						className="px-6">
						[ BEGIN CALIBRATION ]
					</Button>
				</div>
				<div className="text-center text-xs text-gray-600">
					Press ESC anytime to close this tutorial
				</div>
			</div>
		</div>
	);
};

export default TutorialOverlay;
