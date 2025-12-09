const NotebookPanel = ({ notes, onChange }) => {
	const lines = notes.split("\n");
	const lineCount = lines.length;

	return (
		<div className="notebook-panel flex h-full flex-col border border-gray-800 bg-black transition-colors duration-200 focus-within:border-cyan-600/50">
			<div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-3 py-2">
				<div className="flex items-center gap-2">
					<span className="text-xs font-bold tracking-wider text-green-400">
						FIELD NOTES MODULE
					</span>
					<span className="rounded bg-green-900/30 px-1 py-0.5 text-[9px] text-green-600">
						v1.0
					</span>
				</div>
				<div className="text-[9px] text-gray-600">
					AUTO-SAVE ACTIVE
				</div>
			</div>
			<div className="flex flex-1">
				{/* Line numbers */}
				{/* Dynamically shown */}
				<div className="shrink-0 border-r border-gray-800 bg-[#050505] px-2 py-4 select-none">
					<div className="font-mono text-xs leading-normal text-gray-700">
						{Array.from(
							{ length: Math.max(lineCount, 1) },
							(_, i) => (
								<div key={i} className="text-right">
									{String(i + 1).padStart(2, "0")}
								</div>
							)
						)}
					</div>
				</div>
				{/* Textarea */}
				<div className="flex-1 bg-black/50">
					<textarea
						value={notes}
						onChange={(e) => onChange(e.target.value)}
						placeholder="// Enter your observations here..."
						className="scrollbar-thin w-full resize-none border-none bg-transparent p-4 font-mono text-xs leading-normal text-gray-300 placeholder-gray-700 outline-none min-h-[300px]"
					/>
				</div>
			</div>
		</div>
	);
};

export default NotebookPanel;
