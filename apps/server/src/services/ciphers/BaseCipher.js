class BaseCipher {
	constructor(config = {}) {
		this.config = config;
	}

	/**
	 * Encrypt plaintext using the cipher algorithm
	 * @param {string} plaintext - The text to encrypt
	 * @param {object} options - Additional encryption options
	 * @returns {string} Encrypted text
	 */
	encrypt(plaintext, options = {}) {
		throw new Error("encrypt() must be implemented by subclass");
	}

	/**
	 * Decrypt ciphertext using the cipher algorithm
	 * @param {string} ciphertext - The text to decrypt
	 * @param {object} options - Additional decryption options
	 * @returns {string} Decrypted text
	 */
	decrypt(ciphertext, options = {}) {
		throw new Error("decrypt() must be implemented by subclass");
	}

	/**
	 * Validate cipher configuration
	 * @returns {boolean} True if configuration is valid
	 */
	validateConfig() {
		return true;
	}

	/**
	 * Get cipher metadata
	 * @returns {object} Cipher information
	 */
	getMetadata() {
		return {
			name: this.constructor.name,
			config: this.config
		};
	}
}

export default BaseCipher;
