const TerminalInput = ({ value, onChange, onKeyDown, disabled, autoFocus }) => {
	return (
		<div
			id="terminal-input"
			className="flex shrink-0 items-center gap-2 border-t border-gray-800 bg-[#0a0a0a] p-2"
		>
			<span className="text-xs text-green-400">{">"}</span>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={onKeyDown}
				disabled={disabled}
				placeholder="/help"
				className="flex-1 bg-transparent text-xs text-green-400 placeholder-gray-700 outline-none disabled:opacity-50"
				autoFocus={autoFocus}
			/>
		</div>
	);
};

export default TerminalInput;
