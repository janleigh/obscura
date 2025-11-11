import BaseCipher from "./BaseCipher.js";

class PolybiusCipher extends BaseCipher {
	constructor(config = {}) {
		super(config);
		// Standard Polybius square
		// J is alwayus combined with I if yall are wondering
		this.square = config.square || [
			["A", "B", "C", "D", "E"],
			["F", "G", "H", "I", "K"],
			["L", "M", "N", "O", "P"],
			["Q", "R", "S", "T", "U"],
			["V", "W", "X", "Y", "Z"]
		];

		this._buildMaps();
	}

	_buildMaps() {
		this.letterToCoords = {};
		this.coordsToLetter = {};

		for (let row = 0; row < 5; row++) {
			for (let col = 0; col < 5; col++) {
				const letter = this.square[row][col];
				const coords = `${row + 1}${col + 1}`;
				this.letterToCoords[letter] = coords;
				this.coordsToLetter[coords] = letter;

				if (letter === "I") {
					this.letterToCoords["J"] = coords;
				}
			}
		}
	}

	encrypt(plaintext, options = {}) {
		const normalized = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
		let result = "";

		// then we just assign the coords (row and column) to each letter
		// its that simple
		for (let char of normalized) {
			result += this.letterToCoords[char] || "";
		}

		return result;
	}

	decrypt(ciphertext, options = {}) {
		// Remove any non-digit characters
		const normalized = ciphertext.replace(/\D/g, "");

		// well duh, its by pairs
		if (normalized.length % 2 !== 0) {
			throw new Error(
				"Invalid Polybius cipher text: length must be even"
			);
		}

		let result = "";
		for (let i = 0; i < normalized.length; i += 2) {
			const coords = normalized.substring(i, i + 2);
			result += this.coordsToLetter[coords] || "?";
		}

		return result;
	}

	/**
	 * Format encrypted text with spaces for readability
	 */
	encryptFormatted(plaintext, groupSize = 2) {
		const encrypted = this.encrypt(plaintext);
		const groups = [];

		for (let i = 0; i < encrypted.length; i += groupSize * 2) {
			groups.push(encrypted.substring(i, i + groupSize * 2));
		}

		return groups.join(" ");
	}

	getMetadata() {
		return {
			...super.getMetadata(),
			type: "polybius",
			gridSize: "5x5"
		};
	}
}

export default PolybiusCipher;
