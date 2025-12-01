/**
 * Hardcoded level definitions for Obscura
 * Based on the narrative plot. Check Google Docs
 * @neverGiveup222's job
 *
 * Related utilities: See cipherUtils.js for shared cipher constants and helpers
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
		hintLines:["This is easy. Just shift each letter back by 3."],
			answer: "HELLO",
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
    	hintPoem: "In silver tongues I speak of dawn; shift my letters, and truth is drawn.",
    	hintLines: ["Rotate letters by halfway around the alphabet.", "Restore spaces to reconstruct the message."],
    	answer: "I AM READY",
    	pointsValue: 100,
    	storyFragment:
      		"CALIBRATION SUCCESSFUL. Neural translation patterns recorded. Proceeding to next module.",
    	transmission: {
      		message: "Welcome to Project Clarity. Your linguistic profile is exceptional.",
      		storyFragment: null
    	} 
	},
	{
		id: 2,
  		title: "Calibration Module 02",
  		phase: 1,
  		cipherType: "caesar",
  		cipherText: "YMJPJDNXIFBS", 
  		cipherData: { shift: 5 },
  		hintPoem: [
			"Forward I stepped, as letters sway,", 
			"Retrace my path, and find the way.",
			"Five they tumble, shadows in line.",
			"Reveal the truth where the letters shine."
				],
  		hintLines: [
    		"Rotate each letter backwards.",
    		"Observe the poem; it is reliable.",
    		"Count 5 letters back to get the original text.",
			"Observer proper spacing."
		],
  		answer: "THE KEY IS DAWN",
  		pointsValue: 120,
  		storyFragment: "Module 02 complete. Neural translation patterns recorded. Proceeding to next module.",
  		transmission: {
    		message: "Module 02 unlocked. Your linguistic evaluation will be continued. Solve the shift.",
    		storyFragment: null
 		}
	},
	{
		id: 3,
		title: "Calibration Module 03",
		phase: 1,
		cipherType: "vigenere",
		cipherText: "WHAFWANFZENRUICUWOJSHBNHDRUROERRQTD",
		cipherData: { key: "Dawn" },
		hintPoem: ["A single key will guide your hand",
					"Lay it above each letter, as planned.",
					"Repeat its cycle through the night,",
					"Then dawn will show the hidden light."],
		hintLines: [
  			"Analyze the poem carefully for the keyword.",
  			"Write the ciphertext in a line and repeat the keyword above it until lengths match.",
  			"Convert letters to numbers (A=0 … Z=25) and subtract the keyword values from the ciphertext letters.",
  			"Wrap around past A to Z if needed, then read the resulting letters to reconstruct the message."
		],
		answer: "THE STARS WERE RIGHT ON FEBRUARY ELEVENTH",
		pointsValue: 140,
		storyFragment: "Calibration continues. The interface functions normally. Your solution has been recorded; proceed to the next module.",
		transmission: {
  			message: "Module 03 initialized. Apply the provided keyword to complete decryption.",
  			storyFragment: "Keep track of your progress as deeper layers begin to align..."
		}
	},
	
	{
		id: 4,
  		title: "Calibration Module 04",
  		phase: 1,
  		cipherType: "vigenere",
  		cipherText: "LAEFFWPHFAKWIWXWKEEL",
  		cipherData: { key: "STARS" },
  		hintPoem: [
			"It's echo lingers in the silent sky;",
			"Seek the brightest word your mind supplies.",
			"Where starlight shifts and cosmos sways,",
			"Align each letter to find your phrase."
		],
  		hintLines: [
    		"Consider a short, thematic word tied to the night sky.",
    		"Use that word repeatedly as your guide across the ciphertext.",
    		"Apply the same Vigenère method introduced in Module 03."
  		],
  		answer: "THE ONE WHO IS DIFFERENT",
  		pointsValue: 130,
  		storyFragment: "CALIBRATION SEQUENCE CONTINUES. Neural response patterns remain consistent. Preparing next module...",
  		transmission: {
    		message: "Module 04 initialized. Standard alignment parameters engaged",
    		storyFragment: "Pattern recognition stable. Continue observing outputs for consistency."
  		}
	}

	/**{
		id: 1,
		title: "Module 01: Easy Caesar Test",
		phase: 1,
		cipherType: "caesar",
		cipherText: "BRXIRXQGPH",
		cipherData: { shift: 3 },
		hintPoem:
			"GAIVS CAESAR SAYS MY WORDS APPEAR FOREIGN SOLELY BECAUSE THEY DO NOT STAND IN THEIR RIGHTFUL POSITION",
		answer: "YOUFOUNDME",
		storyFragment:
			"Great! You're getting the hang of it. Let's continue...",
		transmission: {
			message: "Testing basic Caesar cipher functionality.",
			storyFragment: null
		}
	},
	{
		id: 2,
		title: "Module 02: ROT13 Challenge",
		phase: 1,
		cipherType: "caesar",
		cipherText: "IVFRIREFN",
		cipherData: { shift: 13 },
		hintPoem: "Thirteen steps in perfect symmetry.",
		answer: "VISEVERSA",
		storyFragment:
			"ROT13 complete. The cipher is named after its creator.",
		transmission: {
			message: "Testing ROT13 functionality.",
			storyFragment: null
		}
	},
	{
		id: 3,
		title: "Module 03: Atbash Test",
		phase: 1,
		cipherType: "atbash",
		cipherText: "ZGYZHS",
		cipherData: {},
		hintPoem:
			"Mirror the alphabet, end meets start, Z becomes A, that's the art.",
		answer: "ATBASH",
		storyFragment:
			"Atbash cipher decoded. One of the oldest ciphers known.",
		transmission: {
			message: "[ATBASH CIPHER TEST]",
			storyFragment: null
		}
	},
	{
		id: 4,
		title: "Module 04: Simple Vigenere",
		phase: 1,
		cipherType: "vigenere",
		cipherText: "ZSAUIRWSLCXCBW",
		cipherData: { key: "KEY" },
		hintPoem: "A wild KEY appeared! What will Pikachu do?",
		answer: "POCKETMONSTERS",
		storyFragment:
			"Vigenère cipher cracked! A classic polyalphabetic substitution.",
		transmission: {
			message: "[VIGENERE TEST - SHORT KEY]",
			storyFragment: null
		}
	},
	{
		id: 5,
		title: "Module 05: Base64 Basics",
		phase: 1,
		cipherType: "base64",
		cipherText: "REVDT0RFRA==",
		cipherData: {},
		hintPoem:
			"Encoded in sixty-four parts, digital transformation starts.",
		answer: "DECODED",
		storyFragment:
			"Base64 decoded successfully. Not encryption, but encoding.",
		transmission: {
			message: "[BASE64 ENCODING TEST]",
			storyFragment: null
		}
	},
	{
		id: 6,
		title: "Module 06: Hidden Message",
		phase: 1,
		cipherType: "steganography",
		cipherText: null,
		cipherData: {},
		hintPoem:
			"Not all secrets are in sight. Sometimes, you gotta think outside the box too.",
		answer: "49126",
		storyFragment:
			"Steganography revealed. The art of hiding messages within images.",
		transmission: {
			message: "[STEGANOGRAPHY TEST - EXAMINE THE IMAGE]",
			imageUrl: "/images/module-6.png",
			type: "image",
			storyFragment: null
		}
	},
	{
		id: 7,
		title: "Module 07: Cipher Chain Test",
		phase: 1,
		cipherType: "chain",
		cipherText:
			"-.- -. . --.- .... ...- --. ..-. .-.. ..-. ..-. -. .... -..- --. - .-.. . ... -.-. .. .--. .--. ..-",
		cipherData: {
			chain: [
				{ type: "morse", config: {} },
				{ type: "vigenere", config: { key: "CICADA" } },
				{ type: "atbash", config: {} },
				{ type: "base64", config: {} }
			]
		},
		hintPoem:
			"The first speaks in dots and dashes fine, then a key from secretive design. Next, reflect to see the light, and finally, encode to end the fight.",
		answer: "ELITEBALLREFERENCE",
		storyFragment:
			"Cipher chain decoded. Multiple layers add complexity.",
		transmission: {
			message: "[CIPHER CHAIN TEST]",
			storyFragment: null
		}
	}**/
	// dummy levels
	// will be replaced by afel
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
