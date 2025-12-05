const PuzzlePanel = ({ level }) => {
	return (
		<div className="flex min-h-[400px] flex-col border border-gray-800 bg-black">
			<div className="shrink-0 border-b border-gray-800 bg-[#0a0a0a] px-4 py-2">
				<span className="text-xs font-bold tracking-wider text-green-400">
					TRANSMISSION LOG
				</span>
			</div>
			<div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4">
				<div className="space-y-4">
					<div className="space-y-1 text-sm text-cyan-400">
						<div># {level.title}</div>
					</div>
					{level.transmission && (
						<div className="border-l-2 border-gray-800 pl-3">
							{level.transmission.type === "image" &&
							level.transmission.imageUrl ? (
								<div className="space-y-2">
									<p className="text-xs text-gray-600">
										{level.transmission.message}
									</p>
									<img
										src={level.transmission.imageUrl}
										alt="Encrypted transmission"
										className="crt-glow h-auto max-w-full rounded border border-gray-800"
										style={{
											maxHeight: "300px",
											imageRendering: "pixelated"
										}}
									/>
									<p className="text-xs text-yellow-600">
										Right-click → Save image to analyze
										offline
									</p>
								</div>
							) : (
								<p className="text-xs text-gray-600">
									{level.transmission.message}
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
										"
									</div>
									<div className="px-6 py-2 text-center text-sm">
										{level.hintPoem}
									</div>
									<div className="absolute right-2 bottom-2 text-lg text-gray-600">
										"
									</div>
								</div>
							</div>
						</div>
					</div>
					{level.transmission.storyFragment && (
						<div className="mt-4 border-t border-gray-800 pt-4">
							<div className="space-y-2">
								<div className="text-xs tracking-wider text-cyan-600">
									# TRANSMISSION FRAGMENT
								</div>
								<div className="border-l-2 border-cyan-800 bg-cyan-950/20 p-3">
									<p className="text-xs leading-relaxed text-cyan-300">
										{level.transmission.storyFragment}
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PuzzlePanel;
