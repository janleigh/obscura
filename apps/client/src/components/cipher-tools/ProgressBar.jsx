const ProgressBar = ({ progress, label = "PROGRESS" }) => {
	if (progress <= 0) return null;

	return (
		<div className="space-y-1">
			<div className="text-[10px] text-gray-500">{label}</div>
			<div className="h-4 overflow-hidden border border-gray-700 bg-[#0a0a0a]">
				<div
					className="h-full bg-green-600 transition-all duration-100"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
