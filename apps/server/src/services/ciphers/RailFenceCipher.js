import BaseCipher from "./BaseCipher.js";

class RailFenceCipher extends BaseCipher {
	constructor(config = {}) {
		super(config);
		this.rails = config.rails || 3; // Default to 3 rails, minimum 2 cause zigzag
	}

	validateConfig() {
		return (
			typeof this.rails === "number" &&
			this.rails >= 2
		);
	}
	
	encrypt(plaintext, options = {}) {
		const rails = options.rails ?? this.rails;
		// Bro how can you do this with less than 2 rails
		// r u dumb?
		if (rails < 2) {
			throw new Error("Number of rails must be at least 2");
		}

		// remove spaces for the cipher
		const clean = plaintext.replace(/\s/g, "");
		// construct the grid
		const fence = Array(rails)
			.fill()
			.map(() => []);
		let rail = 0;
		let direction = 1;

		for (let char of clean) {
			// place character in the current rail
			fence[rail].push(char);
			// increment
			rail += direction
			
			// then we switch direction if we are at the top or bottom rail like a zigzag
			if (rail === 0 || rail === rails - 1) {
				direction *= -1;
			}
		}

		return fence.flat().join("");
	}

	decrypt(ciphertext, options = {}) {
		// TODO!
		return "To be implemented";
	}

	getMetadata() {
		return {
			...super.getMetadata(),
			type: "railfence",
			rails: this.rails
		};
	}
}

export default RailFenceCipher;