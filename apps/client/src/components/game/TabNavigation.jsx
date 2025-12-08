import { useSound } from "../../hooks/useSound";

const TabNavigation = ({ activeTab, onTabChange, onShowTutorial }) => {
	const { playSound } = useSound();
	const tabs = [
		{ id: "solver", label: "HOME" },
		{ id: "phasekeys", label: "PHASE KEYS" },
		{ id: "ciphertools", label: "CIPHER TOOLKIT" }
	];

	const handleTabChange = (tabId) => {
		playSound("switchTabs");
		onTabChange(tabId);
	};

	return (
		<div className="flex items-center justify-between border-b border-gray-800 bg-black px-2 pt-2">
			<div className="flex gap-1">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => handleTabChange(tab.id)}
						className={`relative px-4 py-2 text-xs font-bold transition-all ${
							activeTab === tab.id
								? "border-t-2 border-cyan-500 bg-[#0a0a0a] text-cyan-400"
								: "border-t-2 border-transparent text-gray-600 hover:bg-[#0a0a0a] hover:text-gray-400"
						}`}>
						{activeTab === tab.id && (
							<span className="absolute top-0 left-0 h-0.5 w-full animate-pulse bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
						)}
						{tab.label}
					</button>
				))}
			</div>
			<div className="flex items-center gap-4 pr-2">
				<div className="hidden items-center gap-2 text-[10px] text-gray-600 sm:flex">
					<span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
					SYSTEM ONLINE
				</div>
				<button
					onClick={onShowTutorial}
					className="flex h-6 w-6 items-center justify-center rounded border border-gray-800 text-xs text-gray-500 transition-colors hover:border-cyan-500 hover:text-cyan-400"
					title="Show tutorial">
					?
				</button>
			</div>
		</div>
	);
};

export default TabNavigation;
