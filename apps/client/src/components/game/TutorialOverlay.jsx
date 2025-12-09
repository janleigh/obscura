import { useState } from "react";

const TutorialOverlay = ({ onClose }) => {
	const [isClosing, setIsClosing] = useState(false);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			onClose();
		}, 400);
	};

	return (
		<div className="animate-fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
			<div
				className={`${isClosing ? "animate-crt-turn-off" : "animate-crt-turn-on"} crt-glow max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-cyan-500/50 bg-[#0a0a0a] shadow-[0_0_50px_rgba(6,182,212,0.2)]`}
			>
				{/* Header */}
				<div className="sticky top-0 z-10 flex items-center justify-between border-b border-cyan-500/30 bg-[#0a0a0a] px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="h-3 w-3 animate-pulse bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
						<h2 className="text-lg font-bold tracking-widest text-cyan-400">
							SYSTEM MANUAL
						</h2>
					</div>
					<button
						onClick={handleClose}
						className="group flex items-center gap-2 text-xs text-gray-500 hover:text-cyan-400"
					>
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
									<span className="text-cyan-400">
										TERMINAL
									</span>
								</div>
							</div>
						</div>
					</div>
					{/* Commands Section */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-xs font-bold tracking-wider text-green-600">
							<span className="text-lg">03</span>
							<span>TERMINAL COMMANDS</span>
						</div>
						<div className="grid gap-4 rounded border border-green-900/30 bg-green-950/10 p-4 md:grid-cols-3">
							<div className="space-y-1">
								<code className="text-xs font-bold text-green-400">
									/help
								</code>
								<p className="text-[10px] text-gray-500">
									List available commands
								</p>
							</div>
							<div className="space-y-1">
								<code className="text-xs font-bold text-green-400">
									/clear
								</code>
								<p className="text-[10px] text-gray-500">
									Clear terminal history
								</p>
							</div>
							<div className="space-y-1">
								<code className="text-xs font-bold text-green-400">
									/submit [answer]
								</code>
								<p className="text-[10px] text-gray-500">
									Submit solution for verification
								</p>
							</div>
						</div>
					</div>
				</div>
				{/* Footer */}
				<div className="border-t border-cyan-500/30 bg-[#0a0a0a] px-6 py-4 text-center">
					<p className="text-[10px] tracking-widest text-gray-600">
						OBSCURA PROTOCOL v2.19.5 // AUTHORIZED PERSONNEL ONLY
					</p>
				</div>
			</div>
		</div>
	);
};

export default TutorialOverlay;
