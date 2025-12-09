export const parseCommand = (cmd, onSubmit) => {
	const trimmedCmd = cmd.trim();

	// submit command
	if (trimmedCmd.startsWith("/submit ")) {
		const answer = trimmedCmd.substring(8).trim().toUpperCase();
		if (answer) {
			onSubmit(answer);
			return {
				success: true,
				message: `Submitting answer: ${answer}...`
			};
		} else {
			return {
				error: true,
				message:
					"Error: No answer provided. Usage: /submit <answer>"
			};
		}
	}

	// help command
	if (trimmedCmd === "/help") {
		return {
			help: true,
			messages: [
				"AVAILABLE COMMANDS:",
				"  /submit <answer> - Submit your decoded answer",
				"  /help           - Display this help message",
				"  /clear          - Clear terminal history"
			]
		};
	}

	// clear command
	if (trimmedCmd === "/clear" || trimmedCmd === "/cls") {
		return { clear: true };
	}

	// unknown command
	if (trimmedCmd.startsWith("/")) {
		return {
			error: true,
			message: `Error: Unknown command '${trimmedCmd.split(" ")[0]}'. Type /help for available commands.`
		};
	}

	// treat entire input as answer if no command prefix
	const answer = trimmedCmd.toUpperCase();
	onSubmit(answer);
	return {
		success: true,
		message: `Submitting answer: ${answer}...`
	};
};
