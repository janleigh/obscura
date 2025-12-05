const ActivityLogger = ({ logs, logEndRef, onClear }) => {
	return (
		<div className="h-48 border border-gray-700 bg-black">
			<div className="flex items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-4 py-2">
				<span className="text-xs font-bold text-green-400">
					ACTIVITY LOG
				</span>
				<button
					onClick={onClear}
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
								<span
									className={
										log.type === "ERROR" ||
										log.type === "CRITICAL"
											? "text-red-400"
											: log.type === "SUCCESS"
												? "text-green-400"
												: log.type === "WARNING"
													? "text-yellow-400"
													: log.type ===
																"INFO" ||
														  log.type ===
																"CONFIG"
														? "text-cyan-400"
														: log.type ===
																	"SCAN" ||
															  log.type ===
																	"ANALYSIS" ||
															  log.type ===
																	"DECODE"
															? "text-blue-400"
															: log.type ===
																  "GAME"
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
	);
};

export default ActivityLogger;
