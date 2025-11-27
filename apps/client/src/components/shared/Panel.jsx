const Panel = ({
	children,
	title,
	className = "",
	headerClassName = ""
}) => {
	return (
		<div className={`border border-gray-700 bg-black ${className}`}>
			{title && (
				<div
					className={`border-b border-gray-800 bg-[#0a0a0a] px-4 py-2 ${headerClassName}`}>
					<span className="text-xs font-bold text-green-400">
						{title}
					</span>
				</div>
			)}
			<div className="p-4">{children}</div>
		</div>
	);
};

export default Panel;
