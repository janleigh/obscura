import BaseCipher from "./BaseCipher.js";

class CaesarCipher extends BaseCipher {
	constructor(config = {}) {
		super(config);
		this.shift = config.shift || 13; // Default to ROT13
	}

	validateConfig() {
		return (
			typeof this.shift === "number" &&
			this.shift >= 0 &&
			this.shift <= 25
		);
	}

	encrypt(plaintext, options = {}) {
		const shift = options.shift ?? this.shift;
		return this._transform(plaintext, shift);
	}

	decrypt(ciphertext, options = {}) {
		const shift = options.shift ?? this.shift;
		return this._transform(ciphertext, 26 - shift);
	}

	_transform(text, shift) {
		return text
			.split("")
			.map((char) => {
				// Handle uppercase letters
				if (char >= "A" && char <= "Z") {
					return String.fromCharCode(
						((char.charCodeAt(0) - 65 + shift) % 26) + 65
					);
				}
				// Handle lowercase letters
				if (char >= "a" && char <= "z") {
					return String.fromCharCode(
						((char.charCodeAt(0) - 97 + shift) % 26) + 97
					);
				}
				// Non-alphabetic characters remain unchanged
				return char;
			})
			.join("");
	}

	getMetadata() {
		return {
			...super.getMetadata(),
			type: "caesar",
			shift: this.shift
		};
	}
}

export default CaesarCipher;
