const UsernameInput = ({
	username,
	onChange,
	onSubmit,
	isLoading,
	tutorialText,
	showCursor,
	typingComplete
}) => {
	return (
		<div className="crt-glow animate-fade-in">
			<div className="mb-8 border border-gray-800 bg-[#0f0f0f] p-6">
				<div className="mb-6 border-b border-gray-800 pb-4">
					<span className="text-cyan-400">OBSCURA</span>
					<span className="text-gray-600"> / </span>
					<span className="text-white">AUTHENTICATION</span>
				</div>
				{/* Tutorial */}
				<div className="mb-6 border-l-2 border-cyan-400 pl-4 text-xs text-gray-400">
					{tutorialText}
					{!typingComplete && showCursor && (
						<span className="text-cyan-400">█</span>
					)}
				</div>
				{/* Username input */}
				<div className="space-y-4">
					<label className="block text-xs text-gray-500">
						SYSTEM IDENTIFIER
					</label>
					<div className="flex items-center border-b border-gray-700 bg-transparent pb-2">
						<span className="mr-2 text-cyan-400">→</span>
						<input
							type="text"
							value={username}
							onChange={(e) => onChange(e.target.value)}
							onKeyDown={(e) => {
								if (
									e.key === "Enter" &&
									username.trim() &&
									!isLoading
								) {
									onSubmit();
								}
							}}
							disabled={isLoading}
							className="flex-1 border-none bg-transparent text-white outline-none disabled:text-gray-600"
							autoFocus
							maxLength={32}
							placeholder="enter_username"
						/>
						{!isLoading && showCursor && (
							<span className="ml-1 text-cyan-400">█</span>
						)}
					</div>
				</div>
				{/* Instructions */}
				<div className="mt-6 text-right text-xs text-gray-600">
					<span className="text-gray-500">PRESS</span>{" "}
					<kbd className="rounded border border-gray-700 bg-[#1a1a1a] px-2 py-1 text-gray-400">
						ENTER
					</kbd>{" "}
					<span className="text-gray-500">TO AUTHENTICATE</span>
				</div>
			</div>
		</div>
	);
};

export default UsernameInput;
