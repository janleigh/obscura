const TerminalHistory = ({ history, historyEndRef }) => {
	return (
		<div className="scrollbar-thin min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2 text-[12px]">
			{history.map((entry, idx) => (
				<div
					key={idx}
					className={
						entry.type === "input"
							? "text-green-400"
							: entry.type === "error"
								? "text-red-400"
								: entry.type === "system"
									? "text-cyan-400"
									: "text-gray-500"
					}>
					{entry.type === "input" && "> "}
					{entry.text}
				</div>
			))}
			<div ref={historyEndRef} />
		</div>
	);
};

export default TerminalHistory;
