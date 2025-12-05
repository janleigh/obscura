import { useSound } from "../../hooks/useSound";

const TabNavigation = ({ activeTab, onTabChange, onShowTutorial }) => {
	const { playSound } = useSound();
	const tabs = [
		{ id: "solver", label: "SOLVER" },
		{ id: "phasekeys", label: "PHASE KEYS" },
		{ id: "ciphertools", label: "CIPHER TOOLKIT" }
	];

	const handleTabChange = (tabId) => {
		playSound("switchTabs");
		onTabChange(tabId);
	};

	return (
		<div className="flex gap-2 border-b border-gray-800">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => handleTabChange(tab.id)}
					className={`px-6 py-3 text-sm transition-colors ${
						activeTab === tab.id
							? "border-b-2 border-cyan-400 text-cyan-400"
							: "text-gray-500 hover:text-gray-400"
					}`}>
					{tab.label}
				</button>
			))}
			<button
				onClick={onShowTutorial}
				className="ml-auto px-6 py-3 text-sm text-gray-600 transition-colors hover:text-cyan-400"
				title="Show tutorial">
				?
			</button>
		</div>
	);
};

export default TabNavigation;
