import BaseCipher from "./BaseCipher.js";

class MorseCipher extends BaseCipher {
	constructor(config = {}) {
		super(config);
		this.dotChar = config.dotChar || ".";
		this.dashChar = config.dashChar || "-";
		this.letterSeparator = config.letterSeparator || " ";
		this.wordSeparator = config.wordSeparator || " / ";

		this.morseAlphabet = {
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
			"0": "-----",
			"1": ".----",
			"2": "..---",
			"3": "...--",
			"4": "....-",
			"5": ".....",
			"6": "-....",
			"7": "--...",
			"8": "---..",
			"9": "----.",
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
			"@": ".--.-."
			// should I implement enye?
		};

		// Build reverse mapping
		this.reverseMorse = Object.entries(this.morseAlphabet).reduce(
			(acc, [char, morse]) => {
				acc[morse] = char;
				return acc;
			},
			{}
		);
	}

	encrypt(plaintext, options = {}) {
		const normalized = plaintext.toUpperCase();
		const words = normalized.split(/\s+/);
		const encodedWords = [];

		// we just map each letter to morse and join with separators
		for (let word of words) {
			const letters = word.split("");
			// map each letter to morse code
			const encodedLetters = letters
				.map((char) => this.morseAlphabet[char] || "")
				.filter((code) => code !== "");

			if (encodedLetters.length > 0) {
				encodedWords.push(encodedLetters.join(this.letterSeparator));
			}
		}

		return encodedWords.join(this.wordSeparator);
	}

	decrypt(ciphertext, options = {}) {
		const words = ciphertext.split(this.wordSeparator);
		const decodedWords = [];

		// do the exact same thuing but reverse
		for (let word of words) {
			const letters = word.split(this.letterSeparator);
			const decodedLetters = letters
				.map((morse) => this.reverseMorse[morse.trim()] || "")
				.filter((char) => char !== "");

			if (decodedLetters.length > 0) {
				decodedWords.push(decodedLetters.join(""));
			}
		}

		return decodedWords.join(" ");
	}

	getMetadata() {
		return {
			...super.getMetadata(),
			type: "morse",
			format: `${this.dotChar}/${this.dashChar}`
		};
	}
}

export default MorseCipher;
