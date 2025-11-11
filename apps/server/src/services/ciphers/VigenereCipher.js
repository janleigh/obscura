import BaseCipher from "./BaseCipher.js";

class VigenereCipher extends BaseCipher {
	constructor(config = {}) {
		super(config);
		this.key = config.key || "KEY";
	}

	validateConfig() {
		return (
			typeof this.key === "string" &&
			this.key.length > 0 &&
			/^[A-Za-z]+$/.test(this.key)
		);
	}

	encrypt(plaintext, options = {}) {
		const key = options.key ?? this.key;
		return this._transform(plaintext, key, true);
	}

	decrypt(ciphertext, options = {}) {
		const key = options.key ?? this.key;
		return this._transform(ciphertext, key, false);
	}

	// https://www.youtube.com/watch?v=Ic4BzVggNY8
	// please watch that so I won't explain how this cipher wo5rks
	_transform(text, key, encrypt = true) {
		const normalizedKey = key.toUpperCase();
		let keyIndex = 0;
		let result = "";

		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			const isUpperCase = char >= "A" && char <= "Z";
			const isLowerCase = char >= "a" && char <= "z";

			if (isUpperCase || isLowerCase) {
				// 65 is 'A', 97 is 'a'
				const base = isUpperCase ? 65 : 97;
				// calculate shifted character
				const charCode = char.charCodeAt(0) - base;
				// calculate shift based on key character
				const keyShift = normalizedKey.charCodeAt(keyIndex % normalizedKey.length) - 65;
				// apply shift
				const shift = encrypt ? keyShift : 26 - keyShift;
				// we use the formula: 
				// c_i = (p_i + k_j) mod 26 or p_i = (c_i - k_j + 26) mod 26
				// although the shift calculation above handles both cases
				const newCharCode = (charCode + shift) % 26;
				// append transformed character
				result += String.fromCharCode(newCharCode + base);
				// increment
				keyIndex++;
			} else {
				// Non-alphabetic characters pass through
				result += char;
			}
		}

		return result;
	}

	getMetadata() {
		return {
			...super.getMetadata(),
			type: "vigenere",
			keyLength: this.key.length
		};
	}
}

export default VigenereCipher;
