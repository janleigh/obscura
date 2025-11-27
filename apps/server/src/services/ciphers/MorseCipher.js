import {
	MORSE_ALPHABET,
	MORSE_REVERSE
} from "../../../../../packages/shared/cipherUtils.js";
import BaseCipher from "./BaseCipher.js";

class MorseCipher extends BaseCipher {
	constructor(config = {}) {
		super(config);
		this.dotChar = config.dotChar || ".";
		this.dashChar = config.dashChar || "-";
		this.letterSeparator = config.letterSeparator || " ";
		this.wordSeparator = config.wordSeparator || " / ";

		// Use shared Morse alphabet from utilities
		this.morseAlphabet = MORSE_ALPHABET;
		this.reverseMorse = MORSE_REVERSE;
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
				encodedWords.push(
					encodedLetters.join(this.letterSeparator)
				);
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
