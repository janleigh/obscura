/**
 * Values used for Cipher Toolkit
 */
export const CIPHERS_CONFIG = [
	{
		value: "caesar",
		label: "ROT-CRACK.BF"
	},
	{
		value: "vigenere",
		label: "KEYHUNT.VGE"
	},
	{
		value: "atbash",
		label: "MIRROR-FLIP.REV"
	},
	{
		value: "base64",
		label: "B64-DECODE.UTL"
	},
	{
		value: "polybius",
		label: "GRID-CRACK.DCDR"
	},
	{
		value: "railfence",
		label: "RAIL.FNC"
	},
	{
		value: "morse",
		label: "DOT-DASH-DECODER"
	},
	{
		value: "baconian",
		label: "BACON-PARSE.R"
	},
	{
		value: "steganography",
		label: "STEGO-SCANNER.LSB"
	}
];

/**
 * Standard Polybius Square grid (5x5) for display
 * I/J share the same cell as per convention
 */
export const POLYBIUS_GRID = [
	["A", "B", "C", "D", "E"],
	["F", "G", "H", "I/J", "K"],
	["L", "M", "N", "O", "P"],
	["Q", "R", "S", "T", "U"],
	["V", "W", "X", "Y", "Z"]
];

/**
 * Polybius Square for encryption/decryption (separate I and J)
 * J is omitted, I represents both I and J
 */
export const POLYBIUS_GRID_CIPHER = [
	["A", "B", "C", "D", "E"],
	["F", "G", "H", "I", "K"],
	["L", "M", "N", "O", "P"],
	["Q", "R", "S", "T", "U"],
	["V", "W", "X", "Y", "Z"]
];

/**
 * Generate rail fence pattern for visualization
 * @param {string} text - Text to arrange in rail fence pattern
 * @param {number} rails - Number of rails
 * @returns {Array<Array<{char: string, index: number}>>} Pattern array
 */
export function generateRailFencePattern(text, rails) {
	if (!text || rails < 2) return [];
	const clean = text.replace(/\s/g, "");
	const pattern = Array(rails)
		.fill()
		.map(() => []);
	let rail = 0;
	let direction = 1;

	for (let i = 0; i < clean.length; i++) {
		pattern[rail].push({ char: clean[i], index: i });
		rail += direction;
		if (rail === 0 || rail === rails - 1) {
			direction *= -1;
		}
	}

	return pattern;
}

/**
 * Calculate character frequency in text
 * @param {string} text - Text to analyze
 * @returns {Object} Character frequency map
 */
export function calculateFrequencies(text) {
	const frequencies = {};
	const clean = text.toUpperCase().replace(/[^A-Z]/g, "");

	for (const char of clean) {
		frequencies[char] = (frequencies[char] || 0) + 1;
	}

	return frequencies;
}

/**
 * Get top N most frequent characters
 * @param {Object} frequencies - Frequency map
 * @param {number} n - Number of top chars to return
 * @returns {Array<[string, number]>} Sorted array of [char, count]
 */
export function getTopFrequentChars(frequencies, n = 5) {
	return Object.entries(frequencies)
		.sort((a, b) => b[1] - a[1])
		.slice(0, n);
}

/**
 * Morse code alphabet mapping (International Morse Code)
 */
export const MORSE_ALPHABET = {
	A: ".-",
	B: "-...",
	C: "-.-.",
	D: "-..",
	E: ".",
	F: "..-.",
	G: "--.",
	H: "....",
	I: "..",
	J: ".---",
	K: "-.-",
	L: ".-..",
	M: "--",
	N: "-.",
	O: "---",
	P: ".--.",
	Q: "--.-",
	R: ".-.",
	S: "...",
	T: "-",
	U: "..-",
	V: "...-",
	W: ".--",
	X: "-..-",
	Y: "-.--",
	Z: "--..",
	0: "-----",
	1: ".----",
	2: "..---",
	3: "...--",
	4: "....-",
	5: ".....",
	6: "-....",
	7: "--...",
	8: "---..",
	9: "----.",
	".": ".-.-.-",
	",": "--..--",
	"?": "..--..",
	"'": ".----.",
	"!": "-.-.--",
	"/": "-..-.",
	"(": "-.--.",
	")": "-.--.-",
	"&": ".-...",
	":": "---...",
	";": "-.-.-.",
	"=": "-...-",
	"+": ".-.-.",
	"-": "-....-",
	_: "..--.-",
	'"': ".-..-.",
	$: "...-..-",
	"@": ".--.-.",
	" ": "/"
};

/**
 * Reverse Morse code mapping (Morse -> Character)
 */
export const MORSE_REVERSE = Object.entries(MORSE_ALPHABET).reduce(
	(acc, [char, morse]) => {
		acc[morse] = char;
		return acc;
	},
	{}
);

/**
 * Baconian cipher alphabet (5-bit encoding)
 */
export const BACONIAN_ALPHABET = {
	A: "AAAAA",
	B: "AAAAB",
	C: "AAABA",
	D: "AAABB",
	E: "AABAA",
	F: "AABAB",
	G: "AABBA",
	H: "AABBB",
	I: "ABAAA",
	J: "ABAAB",
	K: "ABABA",
	L: "ABABB",
	M: "ABBAA",
	N: "ABBAB",
	O: "ABBBA",
	P: "ABBBB",
	Q: "BAAAA",
	R: "BAAAB",
	S: "BAABA",
	T: "BAABB",
	U: "BABAA",
	V: "BABAB",
	W: "BABBA",
	X: "BABBB",
	Y: "BBAAA",
	Z: "BBAAB"
};

/**
 * Reverse Baconian mapping
 */
export const BACONIAN_REVERSE = Object.entries(BACONIAN_ALPHABET).reduce(
	(acc, [char, code]) => {
		acc[code] = char;
		return acc;
	},
	{}
);

/**
 * English letter frequencies (percentage)
 * Used for frequency analysis in Vigenère cipher solving
 */
const ENGLISH_FREQS = {
	A: 8.2,
	B: 1.5,
	C: 2.8,
	D: 4.3,
	E: 13.0,
	F: 2.2,
	G: 2.0,
	H: 6.1,
	I: 7.0,
	J: 0.15,
	K: 0.77,
	L: 4.0,
	M: 2.4,
	N: 6.7,
	O: 7.5,
	P: 1.9,
	Q: 0.095,
	R: 6.0,
	S: 6.3,
	T: 9.1,
	U: 2.8,
	V: 0.98,
	W: 2.4,
	X: 0.15,
	Y: 2.0,
	Z: 0.074
};

/**
 * Calculate Index of Coincidence for a given text
 * @param {string} text - Text to analyze
 * @returns {number} Index of Coincidence
 */
const calculateIC = (text) => {
	const counts = {};
	const len = text.length;
	if (len <= 1) return 0;
	for (let char of text) {
		counts[char] = (counts[char] || 0) + 1;
	}
	let sum = 0;
	for (let char in counts) {
		sum += counts[char] * (counts[char] - 1);
	}
	return sum / (len * (len - 1));
};

// this probably works but the key detector is highly experimental and inaccurate
/**
 * Attempt to solve Vigenère cipher by estimating key length and key
 * using frequency analysis and Index of Coincidence
 * @param {string} ciphertext - Cipher text to analyze
 * @returns {Object|null} Result with key, keyLength, confidence or null if failed
 */
export const solveVigenere = (ciphertext) => {
	const cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
	if (cleanText.length < 2) return null;

	const maxKeyLen = Math.min(20, Math.floor(cleanText.length / 2));
	let bestKeyLen = 1;
	let bestAvgIC = 0;

	// Find key length
	for (let len = 1; len <= maxKeyLen; len++) {
		let avgIC = 0;
		for (let i = 0; i < len; i++) {
			let slice = "";
			for (let j = i; j < cleanText.length; j += len) {
				slice += cleanText[j];
			}
			avgIC += calculateIC(slice);
		}
		avgIC /= len;
		if (Math.abs(avgIC - 0.067) < Math.abs(bestAvgIC - 0.067)) {
			bestAvgIC = avgIC;
			bestKeyLen = len;
		}
	}

	// Find key
	let key = "";
	for (let i = 0; i < bestKeyLen; i++) {
		let slice = "";
		for (let j = i; j < cleanText.length; j += bestKeyLen) {
			slice += cleanText[j];
		}

		let bestShift = 0;
		let minChi2 = Infinity;

		for (let shift = 0; shift < 26; shift++) {
			let chi2 = 0;
			const counts = {};
			for (let char of slice) {
				let shiftedChar = String.fromCharCode(
					((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65
				);
				counts[shiftedChar] = (counts[shiftedChar] || 0) + 1;
			}

			for (let charCode = 65; charCode <= 90; charCode++) {
				const char = String.fromCharCode(charCode);
				const observed = counts[char] || 0;
				const expected =
					(ENGLISH_FREQS[char] / 100) * slice.length;
				chi2 += Math.pow(observed - expected, 2) / expected;
			}

			if (chi2 < minChi2) {
				minChi2 = chi2;
				bestShift = shift;
			}
		}
		key += String.fromCharCode(bestShift + 65);
	}
	return { key, keyLength: bestKeyLen, confidence: bestAvgIC };
};

/**
 * Cipher processing time delays (in ms)
 * Used for realistic UI feedback
 */
export const CIPHER_DELAYS = {
	caesar: 400,
	atbash: 300,
	base64: 250,
	morse: 500,
	polybius: 600,
	railfence: 700,
	vigenere: 800,
	baconian: 650,
	steganography: 1000
};
