import { useState } from "react";
import TerminalBoot from "./components/TerminalBoot";

const App = () => {
	const [bootComplete, setBootComplete] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);

	const handleBootComplete = (username) => {
		setCurrentUser(username);
		setBootComplete(true);
	};

	if (!bootComplete) {
		return <TerminalBoot onBootComplete={handleBootComplete} />;
	}

	return (
		<div className="font-kode-mono min-h-screen bg-[#0a0a0a] p-8 text-white">
			<h1 className="mb-4 text-2xl">Welcome, {currentUser}!</h1>
			<p className="text-gray-400">TBD! Make the actual TUI.</p>
		</div>
	);
};

export default App;
