import { useSound } from "../../hooks/useSound";

const RegistrationForm = ({
	username,
	realName,
	onChange,
	onSubmit,
	onBack,
	isLoading,
	error,
	tutorialText,
	showCursor,
	typingComplete
}) => {
	const { playSound } = useSound();

	const handleSubmit = () => {
		playSound("buttonPress");
		onSubmit();
	};

	const handleBack = () => {
		playSound("buttonPress");
		onBack();
	};

	return (
		<div className="crt-glow animate-fade-in">
			<div className="mb-8 border border-gray-800 bg-[#0f0f0f] p-6">
				<div className="mb-6 border-b border-gray-800 pb-4">
					<span className="text-cyan-400">OBSCURA</span>
					<span className="text-gray-600"> / </span>
					<span className="text-white">NEW CANDIDATE</span>
				</div>
				{/* Tutorial */}
				<div className="mb-6 border-l-2 border-yellow-300 pl-4 text-xs text-gray-400">
					{tutorialText}
					{!typingComplete && showCursor && (
						<span className="text-yellow-300">█</span>
					)}
				</div>
				{/* Username display */}
				<div className="mb-4 space-y-2">
					<label className="block text-xs text-gray-600">
						SYSTEM IDENTIFIER
					</label>
					<div className="text-cyan-400">→ {username}</div>
				</div>
				{/* Real name input */}
				<div className="space-y-4">
					<label className="block text-xs text-gray-500">
						CANDIDATE DESIGNATION
					</label>
					<div className="flex items-center border-b border-gray-700 bg-transparent pb-2">
						<span className="mr-2 text-cyan-400">→</span>
						<input
							type="text"
							value={realName}
							onChange={(e) => onChange(e.target.value)}
							onKeyDown={(e) => {
								if (
									e.key === "Enter" &&
									realName.trim() &&
									!isLoading
								) {
									handleSubmit();
								} else if (e.key === "Escape") {
									handleBack();
								}
							}}
							disabled={isLoading}
							className="flex-1 border-none bg-transparent text-white outline-none disabled:text-gray-600"
							autoFocus
							maxLength={64}
						/>
						{!isLoading && showCursor && (
							<span className="ml-1 text-cyan-400">█</span>
						)}
					</div>
				</div>
				{/* Error message */}
				{error && (
					<div className="mt-4 text-xs text-red-400">
						<span className="mr-2">✗</span>
						{error}
					</div>
				)}
				{/* Instructions */}
				<div className="mt-6 flex items-center justify-between text-xs text-gray-600">
					<div>
						<kbd className="rounded border border-gray-700 bg-[#1a1a1a] px-2 py-1 text-gray-400">
							ESC
						</kbd>{" "}
						<span className="text-gray-500">TO GO BACK</span>
					</div>
					<div>
						<span className="text-gray-500">PRESS</span>{" "}
						<kbd className="rounded border border-gray-700 bg-[#1a1a1a] px-2 py-1 text-gray-400">
							ENTER
						</kbd>{" "}
						<span className="text-gray-500">TO REGISTER</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegistrationForm;
