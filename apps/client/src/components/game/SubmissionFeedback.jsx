const SubmissionFeedback = ({ message }) => {
	if (!message) return null;

	return (
		<div className="shrink-0">
			<div
				className={`border p-3 text-sm ${
					message.type === "success"
						? "border-green-700 bg-green-950/30 text-green-400"
						: message.type === "story"
							? "border-cyan-700 bg-cyan-950/30 text-cyan-300"
							: "border-red-700 bg-red-950/30 text-red-400"
				}`}>
				{message.type === "story" ? (
					<div className="space-y-2">
						{message.transmission && (
							<div className="mb-2 text-xs text-gray-500">
								{message.transmission}
							</div>
						)}
						<div className="whitespace-pre-wrap">
							{message.text}
						</div>
					</div>
				) : (
					message.text
				)}
			</div>
		</div>
	);
};

export default SubmissionFeedback;
