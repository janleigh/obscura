import BaseCipher from "./BaseCipher.js";

class BaconianCipher extends BaseCipher {
	constructor(config = {}) {
		super(config);
		this.alphabet = {
			A: "AAAAA",
			B: "AAAAB",
			C: "AAABA",
			D: "AAABB",
			E: "AABAA",
			F: "AABAB",
			G: "AABBA",
			H: "AABBB",
			I: "ABAAA",
			J: "ABAAA",
			K: "ABAAB",
			L: "ABABA",
			M: "ABABB",
			N: "ABBAA",
			O: "ABBAB",
			P: "ABBBA",
			Q: "ABBBB",
			R: "BAAAA",
			S: "BAAAB",
			T: "BAABA",
			U: "BAABB",
			V: "BAABB",
			W: "BABAA",
			X: "BABAB",
			Y: "BABBA",
			Z: "BABBB"
		};

		// Reverse mapping for decryption
		// ths just swaps keys and values in this.alphabet
		this.reverseAlphabet = Object.entries(this.alphabet).reduce(
			(acc, [letter, code]) => {
				acc[code] = letter;
				return acc;
			},
			{}
		);
	}

	encrypt(plaintext, options = {}) {
		const normalized = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
		let result = "";

		// then we just assign the equivalent A/B code to each letter
		for (let char of normalized) {
			result += this.alphabet[char] || "";
		}

		return result;
	}

	decrypt(ciphertext, options = {}) {
		// Remove any characters that aren't A or B
		const normalized = ciphertext.toUpperCase().replace(/[^AB]/g, "");

		if (normalized.length % 5 !== 0) {
			throw new Error(
				"Invalid Baconian cipher text: length must be multiple of 5"
			);
		}

		let result = "";
		// same thiung but reverse
		for (let i = 0; i < normalized.length; i += 5) {
			const code = normalized.substring(i, i + 5);
			result += this.reverseAlphabet[code] || "?";
		}

		return result;
	}

	/**
	 * Hide Baconian cipher in a carrier text using case variations
	 * Lowercase = A, Uppercase = B
	 */
	hideInText(plaintext, carrierText) {
		const encoded = this.encrypt(plaintext);
		const carrier = carrierText.replace(/[^A-Za-z]/g, "");

		if (carrier.length < encoded.length) {
			throw new Error(
				"Carrier text is too short to hide the message"
			);
		}

		let result = "";
		let encodedIndex = 0;

		for (let i = 0; i < carrierText.length; i++) {
			const char = carrierText[i];
			if (/[A-Za-z]/.test(char) && encodedIndex < encoded.length) {
				// Apply encoding: A = lowercase, B = uppercase
				result +=
					encoded[encodedIndex] === "A"
						? char.toLowerCase()
						: char.toUpperCase();
				encodedIndex++;
			} else {
				result += char;
			}
		}

		return result;
	}

	/**
	 * Extract Baconian cipher from carrier text using case variations
	 */
	extractFromText(carrierText) {
		let encoded = "";

		for (let char of carrierText) {
			if (/[A-Z]/.test(char)) {
				encoded += "B";
			} else if (/[a-z]/.test(char)) {
				encoded += "A";
			}
		}

		return this.decrypt(encoded);
	}

	getMetadata() {
		return {
			...super.getMetadata(),
			type: "baconian",
			alphabetSize: 24
		};
	}
}

export default BaconianCipher;
