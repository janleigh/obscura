import { useEffect, useState } from "react";

const STEPS = [
	{
		id: "welcome",
		title: "WELCOME AGENT",
		content:
			"Welcome to the OBSCURA interface. This interactive guide will walk you through the essential modules required for your mission.",
		targetId: null,
		requiredTab: "solver"
	},
	{
		id: "solver-tab",
		title: "NAVIGATION TABS",
		content:
			"Use these tabs to switch between different modules. The 'HOME' tab contains your current assignment.",
		targetId: "tab-solver",
		position: "right",
		requiredTab: "solver"
	},
	{
		id: "puzzle-panel",
		title: "MISSION BRIEFING",
		content:
			"This panel displays your current objective, intercepted transmissions, and encrypted data. Analyze the information carefully.",
		targetId: "puzzle-panel",
		position: "right",
		requiredTab: "solver"
	},
	{
		id: "notebook-panel",
		title: "FIELD NOTES",
		content:
			"Use this secure notepad to record your observations and decrypt messages. Your notes are auto-saved.",
		targetId: "notebook-panel",
		position: "left",
		requiredTab: "solver"
	},
	{
		id: "ciphertools-tab",
		title: "CIPHER TOOLKIT",
		content:
			"Access advanced cryptographic tools here to assist in decryption.",
		targetId: "tab-ciphertools",
		position: "bottom",
		requiredTab: "ciphertools"
	},
	{
		id: "phasekeys-tab",
		title: "PHASE KEYS",
		content: "View collected keys and unlocked clearance levels here.",
		targetId: "tab-phasekeys",
		position: "bottom",
		requiredTab: "phasekeys"
	},
	{
		id: "terminal-input",
		title: "COMMAND TERMINAL",
		content:
			"Execute system commands and submit your final answers here. Type '/help' for a list of commands.",
		targetId: "terminal-input",
		position: "top",
		requiredTab: "solver"
	}
];

const InteractiveTutorial = ({ onClose, onRequestTabChange }) => {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [tooltipStyle, setTooltipStyle] = useState({});
	const [targetRect, setTargetRect] = useState(null);
	const step = STEPS[currentStepIndex];

	useEffect(() => {
		if (step.requiredTab && onRequestTabChange) {
			onRequestTabChange(step.requiredTab);
		}
	}, [step, onRequestTabChange]);

	useEffect(() => {
		const updatePosition = () => {
			if (!step.targetId) {
				setTooltipStyle({
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					position: "fixed"
				});
				setTargetRect(null);
				return;
			}

			const element = document.getElementById(step.targetId);
			if (element) {
				const rect = element.getBoundingClientRect();
				setTargetRect(rect);

				let top = 0;
				let left = 0;
				let transform = "";

				switch (step.position) {
					case "bottom":
						top = rect.bottom + 16;
						left = rect.left + rect.width / 2;
						transform = "translateX(-50%)";
						break;
					case "top":
						top = rect.top - 16;
						left = rect.left + rect.width / 2;
						transform = "translate(-50%, -100%)";
						break;
					case "left":
						top = rect.top + rect.height / 2;
						left = rect.left - 16;
						transform = "translate(-100%, -50%)";
						break;
					case "right":
						top = rect.top + rect.height / 2;
						left = rect.right + 16;
						transform = "translate(0, -50%)";
						break;
					default:
						top = rect.bottom + 16;
						left = rect.left + rect.width / 2;
						transform = "translateX(-50%)";
				}

				setTooltipStyle({
					top: `${top}px`,
					left: `${left}px`,
					transform,
					position: "fixed"
				});
			} else {
				// element not found, retry shortly
				// or just center it as fallback
				setTooltipStyle({
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					position: "fixed"
				});
				setTargetRect(null);
			}
		};

		// initial update
		const timer = setTimeout(updatePosition, 100);
		window.addEventListener("resize", updatePosition);

		return () => {
			window.removeEventListener("resize", updatePosition);
			clearTimeout(timer);
		};
	}, [step]);

	const handleNext = () => {
		if (currentStepIndex < STEPS.length - 1) {
			setCurrentStepIndex((prev) => prev + 1);
		} else {
			onClose();
		}
	};

	const handlePrev = () => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex((prev) => prev - 1);
		}
	};

	return (
		<div className="fixed inset-0 z-50 pointer-events-none">
			<div className="absolute inset-0 bg-black/60 transition-all duration-500" />
			{targetRect && (
				<div
					className="absolute border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 animate-pulse"
					style={{
						top: targetRect.top - 4,
						left: targetRect.left - 4,
						width: targetRect.width + 8,
						height: targetRect.height + 8,
						borderRadius: "4px"
					}}
				/>
			)}
			<div
				className="pointer-events-auto absolute w-80 flex flex-col gap-4 border border-cyan-500/50 bg-[#0a0a0a] p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-md transition-all duration-300"
				style={tooltipStyle}
			>
				<div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 animate-pulse bg-cyan-500" />
						<h3 className="text-sm font-bold tracking-widest text-cyan-400">
							{step.title}
						</h3>
					</div>
					<span className="text-[10px] text-gray-500">
						STEP {currentStepIndex + 1}/{STEPS.length}
					</span>
				</div>
				<p className="text-xs leading-relaxed text-gray-300">
					{step.content}
				</p>
				<div className="flex items-center justify-between pt-2">
					<button
						onClick={onClose}
						className="text-[10px] text-gray-500 hover:text-gray-300"
					>
						[ SKIP ]
					</button>
					<div className="flex gap-2">
						{currentStepIndex > 0 && (
							<button
								onClick={handlePrev}
								className="border border-gray-700 bg-black px-3 py-1 text-[10px] text-gray-400 hover:border-gray-500 hover:text-gray-200"
							>
								PREV
							</button>
						)}
						<button
							onClick={handleNext}
							className="border border-cyan-600 bg-cyan-950/30 px-4 py-1 text-[10px] font-bold text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-300"
						>
							{currentStepIndex === STEPS.length - 1
								? "FINISH"
								: "NEXT"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InteractiveTutorial;
