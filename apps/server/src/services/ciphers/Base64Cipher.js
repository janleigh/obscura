import BaseCipher from "./BaseCipher.js";

class Base64Cipher extends BaseCipher {
	constructor(config = {}) {
		super(config);
	}

	encrypt(plaintext, options = {}) {
		return btoa(plaintext);
	}

	decrypt(ciphertext, options = {}) {
		return atob(ciphertext);
	}

	getMetadata() {
		return {
			...super.getMetadata(),
			type: "base64"
		};
	}
}

export default Base64Cipher;
