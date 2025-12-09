import { useState } from "react";
import { parseCommand } from "../../../../../packages/ui/terminalCommands";
import { useSound } from "../../hooks/useSound";
import { useTerminalHistory } from "../../hooks/useTerminalHistory";
import TerminalHistory from "./TerminalHistory";
import TerminalInput from "./TerminalInput";

const Terminal = ({ onSubmit, isProcessing, message }) => {
	const [command, setCommand] = useState("");
	const { playSound } = useSound();
	const { history, addEntry, clearHistory, historyEndRef } =
		useTerminalHistory([
			{
				type: "system",
				text: "OBSCURA TERMINAL v1.2.0 - Type /help for commands"
			}
		]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && command.trim() && !isProcessing) {
			const cmd = command.trim();
			addEntry("input", cmd);

			// Play button press sound
			playSound("buttonPress");

			const result = parseCommand(cmd, onSubmit);

			if (result.clear) {
				clearHistory();
			} else if (result.help) {
				result.messages.forEach((msg) => addEntry("output", msg));
			} else if (result.error) {
				addEntry("error", result.message);
			} else if (result.success) {
				addEntry("system", result.message);
			}

			setCommand("");
		}
	};

	return (
		<div className="terminal-container font-kode-mono flex h-full flex-col border border-gray-800 bg-black transition-colors duration-200 focus-within:border-cyan-600">
			<TerminalHistory
				history={history}
				historyEndRef={historyEndRef}
				message={message}
			/>
			<TerminalInput
				value={command}
				onChange={setCommand}
				onKeyDown={handleKeyDown}
				disabled={isProcessing}
			/>
		</div>
	);
};

export default Terminal;
