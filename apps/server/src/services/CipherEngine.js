import AtbashCipher from "./ciphers/AtbashCipher.js";
import BaconianCipher from "./ciphers/BaconianCipher.js";
import Base64Cipher from "./ciphers/Base64Cipher.js";
import CaesarCipher from "./ciphers/CaesarCipher.js";
import MorseCipher from "./ciphers/MorseCipher.js";
import PolybiusCipher from "./ciphers/PolybiusCipher.js";
import RailFenceCipher from "./ciphers/RailFenceCipher.js";
import VigenereCipher from "./ciphers/VigenereCipher.js";

class CipherEngine {
	constructor() {
		this.cipherTypes = {
			caesar: CaesarCipher,
			vigenere: VigenereCipher,
			atbash: AtbashCipher,
			base64: Base64Cipher,
			baconian: BaconianCipher,
			polybius: PolybiusCipher,
			railfence: RailFenceCipher,
			morse: MorseCipher
		};
	}

	/**
	 * Create a cipher instance from configuration
	 * @param {string} [type] - Cipher type (caesar, vigenere, etc.)
	 * @param {object} [config] - Cipher-specific configuration
	 * @returns {BaseCipher} Cipher instance
	 */
	createCipher(type, config = {}) {
		const CipherClass = this.cipherTypes[type.toLowerCase()];
		if (!CipherClass) {
			throw new Error(`Unknown cipher type: ${type}`);
		}

		const cipher = new CipherClass(config);
		if (!cipher.validateConfig()) {
			throw new Error(`Invalid configuration for ${type} cipher`);
		}

		return cipher;
	}

	/**
	 * Encrypt text using a single cipher
	 * @param {string} [plaintext] - Text to encrypt
	 * @param {string} [cipherType] - Type of cipher to use
	 * @param {object} [config] - Cipher configuration
	 * @returns {string} Encrypted text
	 */
	encrypt(plaintext, cipherType, config = {}) {
		const cipher = this.createCipher(cipherType, config);
		return cipher.encrypt(plaintext);
	}

	/**
	 * Decrypt text using a single cipher
	 * @param {string} [ciphertext] - Text to decrypt
	 * @param {string} [cipherType] - Type of cipher to use
	 * @param {object} [config] - Cipher configuration
	 * @returns {string} Decrypted text
	 */
	decrypt(ciphertext, cipherType, config = {}) {
		const cipher = this.createCipher(cipherType, config);
		return cipher.decrypt(ciphertext);
	}

	/**
	 * Encrypt text through multiple cipher layers (cipher chain)
	 * Each layer's output becomes the next layer's input
	 * @param {string} [plaintext] - Original text
	 * @param {Array} [cipherChain] - Array of {type, config} objects
	 * @returns {object} Result with ciphertext and chain metadata
	 */
	encryptChain(plaintext, cipherChain) {
		if (!Array.isArray(cipherChain) || cipherChain.length === 0) {
			throw new Error("Cipher chain must be a non-empty array");
		}

		let result = plaintext;
		const chainMetadata = [];

		// Loop each layer and create an cipher instance
		for (let i = 0; i < cipherChain.length; i++) {
			const { type, config } = cipherChain[i];
			const cipher = this.createCipher(type, config);

			try {
				result = cipher.encrypt(result);
				chainMetadata.push({
					layer: i + 1,
					type,
					metadata: cipher.getMetadata(),
					success: true
				});
			} catch (error) {
				throw new Error(
					`Encryption failed at layer ${i + 1} (${type}): ${error.message}`
				);
			}
		}

		return {
			ciphertext: result,
			layers: cipherChain.length,
			chain: chainMetadata
		};
	}

	/**
	 * Decrypt text through multiple cipher layers in reverse order
	 * @param {string} [ciphertext] - Encrypted text
	 * @param {Array} [cipherChain] - Array of {type, config} objects (in encryption order)
	 * @returns {object} Result with plaintext and chain metadata
	 */
	decryptChain(ciphertext, cipherChain) {
		if (!Array.isArray(cipherChain) || cipherChain.length === 0) {
			throw new Error("Cipher chain must be a non-empty array");
		}

		let result = ciphertext;
		const chainMetadata = [];

		// Same logic as encrypt but we decrypt in reverse order
		// It's fucking layered are u duimb?
		for (let i = cipherChain.length - 1; i >= 0; i--) {
			const { type, config } = cipherChain[i];
			const cipher = this.createCipher(type, config);

			try {
				result = cipher.decrypt(result);
				chainMetadata.push({
					layer: cipherChain.length - i,
					type,
					metadata: cipher.getMetadata(),
					success: true
				});
			} catch (error) {
				throw new Error(
					`Decryption failed at layer ${i + 1} (${type}): ${error.message}`
				);
			}
		}

		return {
			plaintext: result,
			layers: cipherChain.length,
			chain: chainMetadata
		};
	}

	/**
	 * Validate a cipher chain configuration
	 * @param {Array} [cipherChain] - Chain to validate
	 * @returns {object} Validation result
	 */
	validateChain(cipherChain) {
		const errors = [];
		const warnings = [];

		if (!Array.isArray(cipherChain)) {
			return {
				valid: false,
				errors: ["Cipher chain must be an array"]
			};
		}

		if (cipherChain.length === 0) {
			return {
				valid: false,
				errors: ["Cipher chain cannot be empty"]
			};
		}

		// Check each layer
		for (let i = 0; i < cipherChain.length; i++) {
			const layer = cipherChain[i];

			if (!layer.type) {
				errors.push(`Layer ${i + 1}: Missing cipher type`);
				continue;
			}

			if (!this.cipherTypes[layer.type.toLowerCase()]) {
				errors.push(
					`Layer ${i + 1}: Unknown cipher type "${layer.type}"`
				);
				continue;
			}

			try {
				const cipher = this.createCipher(
					layer.type,
					layer.config || {}
				);
				if (!cipher.validateConfig()) {
					errors.push(`Layer ${i + 1}: Invalid configuration`);
				}
			} catch (error) {
				errors.push(`Layer ${i + 1}: ${error.message}`);
			}
		}

		// Warnings
		if (cipherChain.length > 5) {
			warnings.push(
				"Chain has more than 5 layers - may be unnecessarily complex"
			);
		}

		return {
			valid: errors.length === 0,
			errors,
			warnings,
			layerCount: cipherChain.length
		};
	}

	/**
	 * Get metadata about all available cipher types
	 * @returns {Array} Array of cipher type information
	 */
	getAvailableCiphers() {
		return Object.keys(this.cipherTypes).map((type) => {
			const CipherClass = this.cipherTypes[type];
			const tempCipher = new CipherClass();
			return {
				type,
				name: CipherClass.name,
				description: tempCipher.getMetadata()
			};
		});
	}

	/**
	 * Create common cipher presets for the game
	 * You use this for the request body
	 */
	static getPresets() {
		return {
			// Simple Caesar with ROT13
			// u dont know rot 13?
			// its fucking a -> n and n -> a
			// and so on.
			rot13: {
				type: "caesar",
				config: { shift: 13 }
			},
			// Vigenère with "OBSCURA" key
			obscuraKey: {
				type: "vigenere",
				config: { key: "OBSCURA" }
			},
			// Polybius + Morse combination
			polybiusMorse: [
				{ type: "polybius", config: {} },
				{ type: "morse", config: {} }
			],
			// Complex 3-layer chain
			complexChain: [
				{ type: "caesar", config: { shift: 7 } },
				{ type: "vigenere", config: { key: "CIPHER" } },
				{ type: "baconian", config: {} }
			]
		};
	}

	/**
	 * Attempt to break a cipher through various analysis methods
	 * @param {string} [ciphertext] - Text to analyze
	 * @returns {object} Analysis results and potential solutions
	 */
	analyzeCipher(ciphertext) {
		const analysis = {
			length: ciphertext.length,
			patterns: {},
			suggestions: []
		};

		// Character frequency analysis
		const charFreq = {};
		for (let char of ciphertext.toUpperCase()) {
			if (/[A-Z]/.test(char)) {
				charFreq[char] = (charFreq[char] || 0) + 1;
			}
		}
		analysis.patterns.frequency = charFreq;

		// Detect possible cipher type
		// If it only has A-Z and spaces, possible substitution cipher
		if (/^[A-Z\s]+$/.test(ciphertext)) {
			analysis.suggestions.push(
				"Likely substitution cipher (Caesar, Vigenere)"
			);
		}
		// If it only has A and B (or spaces), possible Baconian cipher
		if (/^[AB\s]+$/.test(ciphertext)) {
			analysis.suggestions.push("Possible Baconian cipher");
		}
		// If it only has digits and spaces, then its Polybius square cipher
		if (/^[\d\s]+$/.test(ciphertext) && ciphertext.length % 2 === 0) {
			analysis.suggestions.push("Possible Polybius square cipher");
		}
		// Yknow what uses periods and dashes.
		if (/^[\.\-\s\/]+$/.test(ciphertext)) {
			analysis.suggestions.push("Likely Morse code");
		}

		return analysis;
	}

	/**
	 * Test if text is a valid answer for a level using cipher rules
	 * @param {string} [userInput] - User's decryption attempt
	 * @param {string} [expectedAnswer] - Correct answer
	 * @param {object} [options] - Comparison options
	 * @returns {boolean} True if match
	 */
	validateAnswer(userInput, expectedAnswer, options = {}) {
		const normalize = (text) => {
			let normalized = text.toLowerCase().trim();
			if (options.removeSpaces) {
				normalized = normalized.replace(/\s+/g, "");
			}
			if (options.removePunctuation) {
				normalized = normalized.replace(/[^\w\s]/g, "");
			}
			return normalized;
		};

		return normalize(userInput) === normalize(expectedAnswer);
	}
}

export default new CipherEngine();
