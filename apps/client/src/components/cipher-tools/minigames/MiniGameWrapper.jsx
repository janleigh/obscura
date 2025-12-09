import { useState } from "react";
import Button from "../../shared/Button";

const MiniGameWrapper = ({
	title,
	description,
	colors = "green",
	children,
	onSuccess,
	isComplete = false,
	hideFooter = false
}) => {
	const [isClosing, setIsClosing] = useState(false);

	const handleSuccess = () => {
		setIsClosing(true);
		setTimeout(() => {
			onSuccess();
		}, 400);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
			<div
				className={`${isClosing ? "animate-crt-turn-off" : "animate-crt-turn-on"} flex w-full max-w-3xl flex-col border border-${colors}-400 bg-black shadow-lg shadow-${colors}-400/20`}>
				{/* Header */}
				<div
					className={`border-b border-${colors}-400 bg-[#0a0a0a] px-4 py-3`}>
					<div
						className={`text-sm font-bold text-${colors}-400`}>
						{title}
					</div>
					{description && (
						<div className="mt-1 text-xs text-gray-400">
							{description}
						</div>
					)}
				</div>
				{/* Game Area */}
				<div className="flex-1 p-6">{children}</div>
				{/* Footer */}
				{!hideFooter && isComplete && (
					<div
						className={`border-t border-${colors}-400 bg-[#0a0a0a] px-4 py-3`}>
						<div className="flex gap-2">
							<Button
								onClick={handleSuccess}
								variant="success"
								className="flex-1">
								CONTINUE
							</Button>
						</div>
					</div>
				)}
				{/* {!hideFooter && !isComplete && onCancel && (
					<div className="border-t border-gray-700 bg-[#0a0a0a] px-4 py-3">
						<Button
							onClick={onCancel}
							variant="default"
							className="w-full text-xs">
							ABORT MINIGAME
						</Button>
					</div>
				)} */}
			</div>
		</div>
	);
};

export default MiniGameWrapper;
