const BootMessage = ({ line }) => {
	if (line.color === "mixed") {
		return (
			<div className="leading-relaxed">
				{line.parts.map((part, partIndex) => (
					<span key={partIndex} className={part.color}>
						{part.text}
					</span>
				))}
			</div>
		);
	}

	return (
		<div className="leading-relaxed">
			<span className={line.color}>{line.text || "\u00A0"}</span>
		</div>
	);
};

export default BootMessage;
