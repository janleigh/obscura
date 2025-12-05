const NotebookPanel = ({ notes, onChange }) => {
	return (
		<div className="flex min-h-[300px] flex-col border border-gray-800 bg-black">
			<div className="shrink-0 border-b border-gray-800 bg-[#0a0a0a] px-4 py-2">
				<span className="text-xs font-bold tracking-wider text-green-400">
					NOTEBOOK
				</span>
			</div>
			<div className="min-h-0 flex-1 overflow-hidden p-4">
				<textarea
					value={notes}
					onChange={(e) => onChange(e.target.value)}
					placeholder="Insert your notes here..."
					className="scrollbar-thin h-full w-full resize-none border-none bg-transparent font-mono text-xs text-gray-400 outline-none"
				/>
			</div>
		</div>
	);
};

export default NotebookPanel;
