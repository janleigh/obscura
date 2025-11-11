export const commandResponses = {
	help: [
		{ text: "Available commands:", delay: 100 },
		{ text: "> /help — Display this help menu", delay: 150 },
		{ text: "> /analyze", delay: 150 },
		{ text: "> /replay", delay: 150 },
		{ text: "> /decrypt", delay: 150 },
		{ text: "> /logs", delay: 150 },
		{ text: "> /phasekey", delay: 150 },
		{ text: "> /hint", delay: 150 }
	],
	analyze: [
		{ text: "[*] Analyzing data...", delay: 300 },
		{ text: "[+] Analysis complete. No threats detected.", delay: 250 } // placeholder
	],
	replay: [
		{ text: "[*] Replaying last session...", delay: 300 },
		{ text: "[+] Session replayed successfully.", delay: 250 } // placeholder
	],
	decrypt: [
		{ text: "[*] Decrypting data...", delay: 300 },
		{
			text: "[+] Decryption complete. Data is now accessible.",
			delay: 250
		} // placeholder
	],
	logs: [
		{ text: "[*] Fetching logs...", delay: 200 },
		{ text: "[+] Logs retrieved successfully.", delay: 250 } // placeholder
	],
	hint: null, // put the actual code in console.jsx since it requires connection to hint credits and level id
	phasekey: null,
	submit: null,
	shutdown: null,
	echo: null
};

export default commandResponses;
