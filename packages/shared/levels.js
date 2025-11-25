/**
 * Hardcoded level definitions for Obscura
 * Based on the narrative plot. Check Google Docs
 * @neverGiveup222's job
 */
export const LEVELS = [
	{
		id: 0,
		title: "Tutorial: Calibration 00",
		phase: 1,
		cipherType: "caesar",
		cipherText: "KHOOR",
		cipherData: { shift: 3 },
		hintPoem:
			"A gentle push and letters fall into place; retrace three steps to see the face.",
		hintLines: [
			"This is a Caesar shift. Try shifting letters by a small constant.",
			"Shift of 3 is common for an easy start. Shift back base on alphabet."
		],
		answer: "HELLO",
		pointsValue: 10,
		storyFragment:
			"This is a basic check to familiarise you with the interface. Calibration officially begins...",
		transmission: {
			message:
				"Tutorial interface online. The system greets you. Decode below to see the message.",
			storyFragment: null
		}
	},
	{
		id: 1,
		title: "Calibration Module 01",
		phase: 1,
		cipherType: "caesar",
		cipherText: "VNZERNQL",
		cipherData: { shift: 13 },
		hintPoem:
			"In silver tongues I speak of dawn; shift my letters, and truth is drawn.",
		hintLines: [
			"Rotate letters by halfway around the alphabet (13).",
			"This is ROT13/Caesar-13. Decode the message fully, then restore proper spacing to reveal readable sentence."
		],
		answer: "I AM READY",
		pointsValue: 100,
		storyFragment:
			"CALIBRATION SUCCESSFUL. Neural translation patterns recorded. Proceeding to next module.",
		transmission: {
			message:
				"Welcome to Project Clarity. Your linguistic profile is exceptional.",
			storyFragment: null
		}
	},
	{
		id: 2,
    	title: "Calibration Module 02",
    	phase: 1,
    	cipherType: "caesar",
    	cipherText: "YMJPJDNXIFBS", 
    	cipherData: { shift: 5,},
    	hintPoem: "Forward I stepped, as letters sway, Retrace my path, and find the way. Five they tumble, shadows in line, Reveal the key where the letters shine.",
    	hintLines: [
      		"Analyze the poem; it is reliable.", 
      		"Observe proper spacing as previous module.",
      		"Count 5 letters back to reveal plaintext"],
    	answer: "THE KEY IS DAWN",
    	pointsValue: 120,
    	storyFragment: "Module 02 complete. Neural translation patterns recorded. Proceeding to next module.",
    	transmission: {
      		message: 
				"Module 02 unlocked. Your linguistic evaluation will be continued. Solve the shift and uncover the key.",
      		storyFragment: null
    	}
	},
	{
		id: 3,
    	title: "Calibration Module 03",
    	phase: 1,
    	cipherType: "vigenere",
    	cipherText: "WHAFWANFZENRUICUWOJSHBNHDRUROERRQTD",
    	cipherData: { key: "DAWN" },
    	hintPoem: "A single key will guide your hand,Lay it above each letter, as planned. When night recedes and dawn is near, The hidden truth becomes more clear.",
    	hintLines: [
      		"This uses a repeating-key Vigenere. You uncovered the keyword in the previous module",
      		"Write the keyword in-line over the ciphertext, repeating it to match length.",
     		"Convert letters to numbers: A=0, B=1, … Z=25.",
     		"For each ciphertext letter, subtract the paired key value (wrap below A to Z).",
      		"Decode every letter to reconstruct the full message. Apply natural spacing afterward as previous module."
    	],
    	answer: "THE STARS WERE RIGHT ON FEBRUARY ELEVENTH",
    	pointsValue: 140,
    	storyFragment: "Calibration continues. The interface functions normally. Your solution has been recorded; proceed to the next module.",
    	transmission: {
      		message: 
				"Module 03 initialized. Apply the provided keyword to complete decryption.",
      		storyFragment: "Keep track of your progress as deeper layers begin to align..."
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
	if (
		!level ||
		!level.hintLines ||
		hintIndex >= level.hintLines.length
	) {
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
		description:
			"The name of the observatory that received the signal",
		hintText:
			"Where the impossible signal was first heard. Puerto Rico remembers."
	},
	{
		keyName: "PROMPTER",
		phase: 2,
		description: "The entity within the signal",
		hintText:
			"It has no hands, yet writes. It has no voice, yet speaks."
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
