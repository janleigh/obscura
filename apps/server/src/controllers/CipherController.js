import CipherEngine from "../services/CipherEngine.js";
import BaseController from "./BaseController.js";

class CipherController extends BaseController {
	constructor() {
		super();

		this.encrypt = this.encrypt.bind(this);
		this.decrypt = this.decrypt.bind(this);
		this.encryptChain = this.encryptChain.bind(this);
		this.decryptChain = this.decryptChain.bind(this);
		this.validateChain = this.validateChain.bind(this);
		this.getCipherTypes = this.getCipherTypes.bind(this);
		this.analyzeCipher = this.analyzeCipher.bind(this);
		this.getPresets = this.getPresets.bind(this);
	}

	/**
	 * @description POST /api/cipher/encrypt - Encrypt text with a single cipher
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async encrypt(req, res) {
		try {
			const { plaintext, cipherType, config } = req.body;

			if (!plaintext || !cipherType) {
				return this.error(
					res,
					"plaintext and cipherType are required",
					400
				);
			}

			const ciphertext = CipherEngine.encrypt(
				plaintext,
				cipherType,
				config || {}
			);

			return this.success(res, {
				ciphertext,
				cipherType,
				originalLength: plaintext.length,
				encryptedLength: ciphertext.length
			});
		} catch (error) {
			console.error("Encryption error:", error);
			return this.error(res, error.message, 400);
		}
	}

	/**
	 * @description POST /api/cipher/decrypt - Decrypt text with a single cipher
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async decrypt(req, res) {
		try {
			const { ciphertext, cipherType, config } = req.body;

			if (!ciphertext || !cipherType) {
				return this.error(
					res,
					"ciphertext and cipherType are required",
					400
				);
			}

			const plaintext = CipherEngine.decrypt(
				ciphertext,
				cipherType,
				config || {}
			);

			return this.success(res, {
				plaintext,
				cipherType,
				encryptedLength: ciphertext.length,
				decryptedLength: plaintext.length
			});
		} catch (error) {
			console.error("Decryption error:", error);
			return this.error(res, error.message, 400);
		}
	}

	/**
	 * @description POST /api/cipher/chain/encrypt - Encrypt through multiple cipher layers
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async encryptChain(req, res) {
		try {
			const { plaintext, cipherChain } = req.body;

			if (!plaintext || !cipherChain) {
				return this.error(
					res,
					"plaintext and cipherChain are required",
					400
				);
			}

			// Validate chain first
			const validation = CipherEngine.validateChain(cipherChain);
			if (!validation.valid) {
				return this.error(
					res,
					`Invalid cipher chain: ${validation.errors.join(", ")}`,
					400
				);
			}

			const result = CipherEngine.encryptChain(
				plaintext,
				cipherChain
			);

			return this.success(res, {
				...result,
				originalLength: plaintext.length,
				warnings: validation.warnings
			});
		} catch (error) {
			console.error("Chain encryption error:", error);
			return this.error(res, error.message, 400);
		}
	}

	/**
	 * @description POST /api/cipher/chain/decrypt - Decrypt through multiple cipher layers
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async decryptChain(req, res) {
		try {
			const { ciphertext, cipherChain } = req.body;

			if (!ciphertext || !cipherChain) {
				return this.error(
					res,
					"ciphertext and cipherChain are required",
					400
				);
			}

			// Validate chain first
			const validation = CipherEngine.validateChain(cipherChain);
			if (!validation.valid) {
				return this.error(
					res,
					`Invalid cipher chain: ${validation.errors.join(", ")}`,
					400
				);
			}

			const result = CipherEngine.decryptChain(
				ciphertext,
				cipherChain
			);

			return this.success(res, {
				...result,
				encryptedLength: ciphertext.length,
				warnings: validation.warnings
			});
		} catch (error) {
			console.error("Chain decryption error:", error);
			return this.error(res, error.message, 400);
		}
	}

	/**
	 * @description POST /api/cipher/chain/validate - Validate a cipher chain configuration
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async validateChain(req, res) {
		try {
			const { cipherChain } = req.body;

			if (!cipherChain) {
				return this.error(res, "cipherChain is required", 400);
			}

			const validation = CipherEngine.validateChain(cipherChain);

			if (validation.valid) {
				return this.success(res, validation);
			} else {
				return this.error(
					res,
					"Invalid cipher chain",
					400,
					validation
				);
			}
		} catch (error) {
			console.error("Chain validation error:", error);
			return this.serverError(res, error.message);
		}
	}

	/**
	 * @description GET /api/cipher/types - Get all available cipher types
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async getCipherTypes(req, res) {
		try {
			const cipherTypes = CipherEngine.getAvailableCiphers();
			return this.success(res, {
				ciphers: cipherTypes,
				count: cipherTypes.length
			});
		} catch (error) {
			console.error("Error fetching cipher types:", error);
			return this.serverError(
				res,
				"Failed to retrieve cipher types"
			);
		}
	}

	/**
	 * @description POST /api/cipher/analyze - Analyze ciphertext to suggest cipher types
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async analyzeCipher(req, res) {
		try {
			const { ciphertext } = req.body;

			if (!ciphertext) {
				return this.error(res, "ciphertext is required", 400);
			}

			const analysis = CipherEngine.analyzeCipher(ciphertext);

			return this.success(res, analysis);
		} catch (error) {
			console.error("Analysis error:", error);
			return this.serverError(res, "Failed to analyze ciphertext");
		}
	}

	/**
	 * @description GET /api/cipher/presets - Get common cipher presets
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async getPresets(req, res) {
		try {
			const presets = CipherEngine.constructor.getPresets();
			return this.success(res, {
				presets,
				count: Object.keys(presets).length
			});
		} catch (error) {
			console.error("Error fetching presets:", error);
			return this.serverError(res, "Failed to retrieve presets");
		}
	}
}

export default new CipherController();
