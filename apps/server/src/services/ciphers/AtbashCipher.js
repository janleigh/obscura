import BaseCipher from "./BaseCipher.js";

class AtbashCipher extends BaseCipher {
	constructor(config = {}) {
		super(config);

		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.reversedAlphabet = this.alphabet.split("").reverse().join("");
	}

	// It's just a reverse alphabet
	// not that hard
	encrypt(plaintext, options = {}) {
		return plaintext
			.toUpperCase()
			.split("")
			.map((char) => {
				const index = this.alphabet.indexOf(char);
				return index !== -1 ? this.reversedAlphabet[index] : char;
			})
			.join("");
	}

	decrypt(ciphertext, options = {}) {
		return ciphertext
			.toUpperCase()
			.split("")
			.map((char) => {
				const index = this.reversedAlphabet.indexOf(char);
				return index !== -1 ? this.alphabet[index] : char;
			})
			.join("");
	}

	getMetadata() {
		return {
			...super.getMetadata(),
			type: "atbash"
		};
	}
}

export default AtbashCipher;
