const PhaseKeys = () => {
	return (
		<div className="flex flex-1 flex-col h-full items-center justify-center gap-6 p-8">
			<div className="max-w-lg space-y-6 border border-cyan-800 bg-[#0a0a0a] p-8 text-center shadow-[0_0_30px_rgba(8,145,178,0.1)]">
				<div className="flex items-center justify-center gap-2 text-xs tracking-widest text-gray-500">
					<span className="h-px w-8 bg-gray-800"></span>
					[ FEATURE UNAVAILABLE ]
					<span className="h-px w-8 bg-gray-800"></span>
				</div>
				<div className="text-2xl font-bold text-cyan-400">
					PHASE KEYS MODULE
				</div>
				<div className="space-y-4 text-sm text-gray-400">
					<p>
						This feature is currently being designed and is not yet
						available for candidate interaction.
					</p>
					<p className="animate-pulse text-cyan-600">
						Standby for future implementation...
					</p>
				</div>
				<div className="border-t border-gray-800 pt-4">
					<div className="flex justify-center gap-4 text-xs text-gray-600">
						<span>
							STATUS:{" "}
							<span className="text-yellow-400">
								IN DEVELOPMENT
							</span>
						</span>
					</div>
				</div>
			</div>
			<div className="text-xs text-center text-gray-600">
					Solve the CIPHERS or explore the CIPHER TOOLKIT while
					<br />
					awaiting new modules.
				</div>
		</div>
	);
};

export default PhaseKeys;
