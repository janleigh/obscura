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
		title: "Tutorial: Calibration Module 00-A",
		phase: 1,
		cipherType: "caesar",
		cipherText: "KHOOR",
		cipherData: { shift: 3 },
		hintPoem:
			"GAIVS CAESAR SAYS MY WORDS APPEAR FOREIGN, FOR THEY HAVE MARCHED AWAY FROM THEIR RIGHTFUL POSITION.",
		answer: "HELLO",
		storyFragment:
			"This is a basic check to familiarize you with the interface. Proceeding to next tutorial.",
		transmission: {
			message:
				"Hello, and welcome to Project Clarity. Let's begin with a simple test. Decrypt the following message to proceed.",
			storyFragment: null
		}
	},
	{
		id: 1,
		title: "Tutorial: Calibration Module 00-B",
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
			message:
				"Well done. That was too easy. Try this next one. Make sure to *think outside the box*.",
			imageUrl: "/images/module-6.png",
			type: "image",
			storyFragment: null
		}
	},
	{
		id: 2,
		title: "Tutorial: Calibration Module 00-C",
		phase: 1,
		cipherType: "chain",
		cipherText:
			"-..- .-- - --. -.-- -.-- -... .-- --.- .. -.-- ..- -..- --.- -..- -- .- ...-",
		cipherData: {
			chain: [
				{ type: "morse", config: {} },
				{ type: "vigenere", config: { key: "CICADA" } },
				{ type: "atbash", config: {} }
			]
		},
		minigameType: "memory", // Memory game for complex chains
		hintPoem:
			"Samuel's dots hide a sleeping swarm. The 17-year bug is the key you need. When Alpha becomes Omega, the message will bleed.",
		answer: "ELITEBALLREFERENCE",
		storyFragment:
			"Cipher chain decoded. Multiple layers add complexity. Now you're ready for real calibration.",
		transmission: {
			message:
				"Excellent work. Now, let's see how you handle multiple layers. Decrypt the following chained message.",
			storyFragment: null
		}
	},
	{
		id: 3,
		title: "Calibration Module 01",
		phase: 1,
		cipherType: "caesar",
		cipherText: "VNZERNQL",
		cipherData: { shift: 13 },
		hintPoem:
			"What is done can be undone by doing the same thing again. I am my own inverse.",
		answer: "IAMREADY",
		storyFragment:
			"Neural translation patterns recorded. Proceeding to next module.",
		transmission: {
			message:
				"Your linguistic evaluation begins now. Solve the shift.",
			storyFragment: null
		}
	},
	{
		id: 4,
		title: "Calibration Module 02",
		phase: 1,
		cipherType: "caesar",
		cipherText: "YMJPJDNXIFBS",
		cipherData: { shift: 5 },
		hintPoem: [
			"A solo voice speaks nonsense. But bring a quintet to the stage, and the harmony becomes clear."
		],
		answer: "THEKEYISDAWN",
		storyFragment:
			"Neural translation patterns recorded. Proceeding to next module.",
		transmission: {
			message:
				"Your linguistic evaluation will be continued. Solve the shift.",
			storyFragment: null
		}
	},
	{
		id: 5,
		title: "Calibration Module 03",
		phase: 1,
		cipherType: "vigenere",
		cipherText: "WHAFWANFZENRUICUWOJSHBNHDRUROERRQTD",
		hintPoem: [
			"Darkness fades as time moves on, All shadows fly when night is gone. Wait for the light to paint the grey, Now begins the brand new day."
		],
		answer: "THESTARSWERERIGHTONFEBRUARYELEVENTH",
		storyFragment:
			"Your solution has been recorded. Proceeding to next module.",
		transmission: {
			message:
				"Your linguistic evaluation will be continued. Solve the shift.",
			storyFragment: "never gonna give you up"
		}
	},
	{
		id: 6,
		title: "Calibration Module 04",
		phase: 1,
		cipherType: "vigenere",
		cipherText: "LAEFFWPHFAKWIWXWKEEL",
		cipherData: { key: "STARS" },
		hintPoem: [
			"I vanish in the morning light, But I am the ruler of the night. I am not the Moon, lonely and pale, But a burning legion that tells the tale."
		],
		answer: "THEONEWHOISDIFFERENT",
		storyFragment:
			"Neural response patterns remain consistent. Preparing next module.",
		transmission: {
			message:
				"Deepening linguistic patterns detected. Continue your evaluation.",
			storyFragment: null
		}
	}
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
