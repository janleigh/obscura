export const parseCommand = (cmd, onSubmit) => {
	const trimmedCmd = cmd.trim();

	// Submit command
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

	// Help command
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

	// Clear command
	if (trimmedCmd === "/clear" || trimmedCmd === "/cls") {
		return { clear: true };
	}

	// Unknown command
	if (trimmedCmd.startsWith("/")) {
		return {
			error: true,
			message: `Error: Unknown command '${trimmedCmd.split(" ")[0]}'. Type /help for available commands.`
		};
	}

	// If command without /, treat entire input as answer
	const answer = trimmedCmd.toUpperCase();
	onSubmit(answer);
	return {
		success: true,
		message: `Submitting answer: ${answer}...`
	};
};
