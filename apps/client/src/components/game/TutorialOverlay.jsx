const TutorialOverlay = ({ onClose }) => {
	return (
		<div className="animate-fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
			<div className="crt-glow max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-cyan-500/50 bg-[#0a0a0a] shadow-[0_0_50px_rgba(6,182,212,0.2)]">
				{/* Header */}
				<div className="sticky top-0 z-10 flex items-center justify-between border-b border-cyan-500/30 bg-[#0a0a0a] px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="h-3 w-3 animate-pulse bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
						<h2 className="text-lg font-bold tracking-widest text-cyan-400">
							SYSTEM MANUAL
						</h2>
					</div>
					<button
						onClick={onClose}
						className="group flex items-center gap-2 text-xs text-gray-500 hover:text-cyan-400">
						<span>[ CLOSE MANUAL ]</span>
						<span className="flex h-5 w-5 items-center justify-center rounded border border-gray-700 bg-black text-[10px] group-hover:border-cyan-500">
							ESC
						</span>
					</button>
				</div>
				{/* Content */}
				<div className="space-y-8 p-8">
					<div className="grid gap-8 md:grid-cols-2">
						{/* Navigation Section */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-600">
								<span className="text-lg">01</span>
								<span>INTERFACE NAVIGATION</span>
							</div>
							<div className="space-y-3 border-l-2 border-cyan-900/50 pl-4 text-xs text-gray-400">
								<div className="group">
									<span className="block font-bold text-gray-300 group-hover:text-cyan-400">
										SOLVER_MODULE
									</span>
									<span>
										Primary interface for decryption
										and analysis.
									</span>
								</div>
								<div className="group">
									<span className="block font-bold text-gray-300 group-hover:text-cyan-400">
										PHASE_KEYS [NOT IMPLEMENTED]
									</span>
									<span>
										Storage for unlocked cryptographic
										keys.
									</span>
								</div>
								<div className="group">
									<span className="block font-bold text-gray-300 group-hover:text-cyan-400">
										CIPHER_TOOLKIT
									</span>
									<span>
										Utilities for algorithmic
										manipulation.
									</span>
								</div>
							</div>
						</div>
						{/* Gameplay Section */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-xs font-bold tracking-wider text-yellow-600">
								<span className="text-lg">02</span>
								<span>OPERATIONAL PROCEDURES</span>
							</div>
							<div className="space-y-3 border-l-2 border-yellow-900/50 pl-4 text-xs text-gray-400">
								<div>
									1. ANALYZE{" "}
									<span className="text-green-400">
										CIPHER_TEXT
									</span>{" "}
									AND{" "}
									<span className="text-cyan-400">
										HINTS
									</span>
								</div>
								<div>
									2. UTILIZE{" "}
									<span className="text-yellow-400">
										FIELD NOTES MODULE
									</span>{" "}
									FOR DEDUCTION
								</div>
								<div>
									3. INPUT SOLUTION VIA{" "}
									<span className="text-green-400">
										TERMINAL
									</span>
								</div>
								<div>
									4. UNLOCK{" "}
									<span className="text-cyan-400">
										STORY_FRAGMENTS
									</span>{" "}
									[PARTIALLY IMPLEMENTED]
								</div>
							</div>
						</div>
					</div>
					{/* Tips Section */}
					<div className="border border-green-900/30 bg-green-950/10 p-4">
						<div className="mb-2 flex items-center gap-2 text-xs font-bold text-green-500">
							<span className="text-lg">ℹ</span>
							<span>FIELD ADVISORY</span>
						</div>
						<ul className="grid gap-2 text-xs text-gray-400 md:grid-cols-2">
							<li className="flex items-center gap-2">
								<span className="h-1 w-1 bg-green-500"></span>
								<span>
									Use fullscreen for immersive mode
								</span>
							</li>
							<li className="flex items-center gap-2">
								<span className="h-1 w-1 bg-green-500"></span>
								<span>
									Hints often reveal the cipher method
								</span>
							</li>
							<li className="flex items-center gap-2">
								<span className="h-1 w-1 bg-green-500"></span>
								<span>
									Progress is auto-saved to local storage
								</span>
							</li>
						</ul>
					</div>
					<button
						onClick={onClose}
						className="w-full border border-cyan-900/50 bg-cyan-950/20 py-3 text-xs font-bold tracking-widest text-cyan-400 transition-all hover:bg-cyan-900/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
						ACKNOWLEDGE AND CLOSE
					</button>
				</div>
			</div>
		</div>
	);
};

export default TutorialOverlay;
