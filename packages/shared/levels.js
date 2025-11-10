/**
 * Hardcoded level definitions for Obscura
 * Based on the narrative plot. Check Google Docs
 */
export const LEVELS = [
	{
		id: 1,
		title: "Calibration Module 01",
		phase: 1,
		cipherType: "caesar",
		cipherText:
			"",
		cipherData: { shift: 13 },
		hintPoem:
			"",
		hintLines: [
			""
		],
		answer: "",
		pointsValue: 100,
		storyFragment:
			"CALIBRATION SUCCESSFUL. Neural translation patterns recorded. Proceeding to next module.",
		transmission: {
			message: "Welcome to Project Clarity. Your linguistic profile is exceptional.",
			storyFragment: null
		}
	}
	// TODO: Add remaining 31 levels following the narrative progression
	// Level 5: First journal entry (Dr. XXX)
	// Level 7: Memo about dreams
	// Level 9: Journal about hearing voices
	// Level 12: Emergency Protocol Alpha-9
	// Level 15: Time loop revelation
	// Level 18: Domain registration twist
	// Level 21: "What is your name?"
	// Level 23: Cryptolinguist's notes
	// Level 28: Lab 4 incident
	// Level 30: The Prompter's Journal
	// Level 32: Final choice - Prime Cipher
];

/**
 * Get a level by ID
 * @param {number} id - Level ID
 * @returns {object|null} Level object or null if not found
 */
export function getLevelById(id) {
	return LEVELS.find((level) => level.id === id) || null;
}

/**
 * Get all levels for a specific phase
 * @param {number} phase - Phase number (1, 2, or 3)
 * @returns {Array} Array of levels in that phase
 */
export function getLevelsByPhase(phase) {
	return LEVELS.filter((level) => level.phase === phase);
}

/**
 * Validate answer against level
 * @param {number} levelId - Level ID
 * @param {string} answer - Player's answer
 * @returns {boolean} True if answer is correct
 */
export function validateAnswer(levelId, answer) {
	const level = getLevelById(levelId);
	if (!level) return false;

	const normalizedAnswer = answer.toLowerCase().trim();
	const normalizedCorrect = level.answer.toLowerCase().trim();

	return normalizedAnswer === normalizedCorrect;
}

/**
 * Get hint line by index
 * @param {number} levelId - Level ID
 * @param {number} hintIndex - Hint line index (0-based)
 * @returns {string|null} Hint line or null
 */
export function getHint(levelId, hintIndex) {
	const level = getLevelById(levelId);
	if (!level || !level.hintLines || hintIndex >= level.hintLines.length) {
		return null;
	}
	return level.hintLines[hintIndex];
}

/**
 * Phase Keys for unlocking "Deep Archives"
 * We actually need to show the prologue for some oif these lmao
 */
export const PHASE_KEYS = [
	{
		keyName: "ARECIBO",
		phase: 1,
		description: "The name of the observatory that received the signal",
		hintText:
			"Where the impossible signal was first heard. Puerto Rico remembers."
	},
	{
		keyName: "PROMPTER",
		phase: 2,
		description: "The entity within the signal",
		hintText: "It has no hands, yet writes. It has no voice, yet speaks."
	},
	{
		keyName: "OUROBOROS",
		phase: 3,
		description: "The nature of the transmission",
		hintText:
			"A serpent eating its own tail. A message that teaches how to decode itself."
	}
];

/**
 * Terminal commands available to players
 */
export const TERMINAL_COMMANDS = {
	HINT: "Request a hint (costs 1 hint credit)",
	SUBMIT: "Submit your answer for validation",
	LOGS: "View your activity log",
	HELP: "Display available commands",
	PHASEKEY: "Enter a Phase Key to unlock Deep Archives",
	CLEAR: "Clear the terminal screen",
	STATUS: "Show your current progress",
	REPLAY: "Replay the current level's introduction",
	ANALYZE: "Show cipher type and difficulty",
	DECRYPT: "Attempt to decrypt with a specified key"
};
