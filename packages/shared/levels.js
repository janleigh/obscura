/**
 * Hardcoded level definitions for Obscura
 * Based on the narrative plot. Check Google Docs
 * @neverGiveup222's job
 *
 * Related utilities: See cipherUtils.js for shared cipher constants and helpers
 */
export const LEVELS = [
	{
		id: 0,
		title: "Tutorial: Calibration Module 00-A",
		phase: 1,
		cipherType: "caesar",
		cipherText: "KHOOR",
		cipherData: { shift: 3 },
		hintPoem:
			"GAIVS CAESAR SAYS MY WORDS APPEAR FOREIGN SOLELY BECAUSE THEY DO NOT STAND IN THEIR RIGHTFUL POSITION",
		answer: "HELLO",
		storyFragment:
			"This is a basic check to familiarize you with the interface. Proceeding to next tutorial.",
		transmission: {
			message:
				"Hello, and welcome to Project Clarity. Let's begin with a simple test. Decrypt the following message to proceed.",
			storyFragment: null
		}
	},
	{
		id: 1,
		title: "Tutorial: Calibration Module 00-B",
		phase: 1,
		cipherType: "steganography",
		cipherText: null,
		cipherData: {},
		hintPoem:
			"Not all secrets are in sight. Sometimes, you gotta think outside the box too.",
		answer: "49126",
		storyFragment:
			"Steganography revealed. The art of hiding messages within images.",
		transmission: {
			message: "Well done. That was too easy. Try this next one. Make sure to *think outside the box*.",
			imageUrl: "/images/module-6.png",
			type: "image",
			storyFragment: null
		}
	},
	{
		id: 2,
		title: "Tutorial: Calibration Module 00-C",
		phase: 1,
		cipherType: "chain",
		cipherText:
			"-.- -. . --.- .... ...- --. ..-. .-.. ..-. ..-. -. .... -..- --. - .-.. . ... -.-. .. .--. .--. ..-",
		cipherData: {
			chain: [
				{ type: "morse", config: {} },
				{ type: "vigenere", config: { key: "CICADA" } },
				{ type: "atbash", config: {} },
				{ type: "base64", config: {} }
			]
		},
		hintPoem:
			"The first speaks in dots and dashes fine, then a key from secretive design. Next, reflect to see the light, and finally, encode to end the fight.",
		answer: "ELITEBALLREFERENCE",
		storyFragment:
			"Cipher chain decoded. Multiple layers add complexity. Now you're ready for real calibration.",
		transmission: {
			message: "Excellent work. Now, let's see how you handle multiple layers. Decrypt the following chained message.",
			storyFragment: null
		}
	},
	{
		id: 3,
		title: "Calibration Module 01",
		phase: 1,
		cipherType: "caesar",
		cipherText: "VNZERNQL",
		cipherData: { shift: 13 },
		hintPoem:
			"What is done can be undone by doing the same thing again. I am my own inverse.",
		answer: "IAMREADY",
		storyFragment:
			"Neural translation patterns recorded. Proceeding to next module.",
		transmission: {
			message:
				"Your linguistic evaluation begins now. Solve the shift.",
			storyFragment: null
		}
	},
	{
		id: 4,
		title: "Calibration Module 02",
		phase: 1,
		cipherType: "caesar",
		cipherText: "YMJPJDNXIFBS",
		cipherData: { shift: 5 },
		hintPoem: [
			"A solo voice speaks nonsense. But bring a quintet to the stage, and the harmony becomes clear."
		],
		answer: "THEKEYISDAWN",
		storyFragment:
			"Neural translation patterns recorded. Proceeding to next module.",
		transmission: {
			message:
				"Your linguistic evaluation will be continued. Solve the shift.",
			storyFragment: null
		}
	},
	{
		id: 5,
		title: "Calibration Module 03",
		phase: 1,
		cipherType: "vigenere",
		cipherText: "WHAFWANFZENRUICUWOJSHBNHDRUROERRQTD",
		hintPoem: [
			"Darkness fades as time moves on, All shadows fly when night is gone. Wait for the light to paint the grey, Now begins the brand new day.",
		],
		answer: "THESTARSWERERIGHTONFEBRUARYELEVENTH",
		storyFragment:
			"Your solution has been recorded. Proceeding to next module.",
		transmission: {
			message:
				"Your linguistic evaluation will be continued. Solve the shift.",
			storyFragment: "never gonna give you up"
		}
	},
	{
		id: 6,
		title: "Calibration Module 04",
		phase: 1,
		cipherType: "vigenere",
		cipherText: "LAEFFWPHFAKWIWXWKEEL",
		cipherData: { key: "STARS" },
		hintPoem: [
			"I vanish in the morning light, But I am the ruler of the night. I am not the Moon, lonely and pale, But a burning legion that tells the tale."
		],
		answer: "THEONEWHOISDIFFERENT",
		pointsValue: 130,
		storyFragment:
			"Neural response patterns remain consistent. Preparing next module.",
		transmission: {
			message:
				"Deepening linguistic patterns detected. Continue your evaluation.",
			storyFragment: null
		}
	},
	{
		id: 7,
    	title: "Calibration Module 05",
    	phase: 2,
    	cipherType: "caesar",
    	cipherText: "PD.WXUZQ'EVAGDZMX,QZFDK12:FTQEUSZMXOMYQRDAYSDUP47°Z.IQETAGXPZ'FTMHQXUEFQZQP.FTQYAPGXMFUAZYMFOTQEZAWZAIZXMZSGMSQRMYUXK.UF'EZAFOAYYGZUOMFUAZNGFDQOGDEUAZ.PAOGYQZFQHQDKFTUZS.FTQK'DQIMFOTUZSFTQXASEZAI.",
    	cipherData: { shift: 12 },
    	hintPoem: "Turn back the dial a dozen times, watch each letter slip through signs.",
    	answer: "DR. KLINE'S JOURNAL, ENTRY 12: THE SIGNAL CAME FROM GRID 47°N. WE SHOULDN'T HAVE LISTENED. THE MODULATION MATCHES NO KNOWN LANGUAGE FAMILY. IT'S NOT COMMUNICATION BUT RECURSION. DOCUMENT EVERYTHING. THEY'RE WATCHING THE LOGS NOW.",
    	pointsValue: 140,
    	storyFragment: "Archival text is degraded; logs may contain gaps. This is normal. The entry stabilizes after minor distortion. Source unverified. Proceed to the next module.",
  		transmission: {
    		message: "Module 05 initialized. Calibration parameters set. Ensure proper reconstruction of decoded data; check punctuation and formatting. Proceed with decryption.",
    		storyFragment: "A non-corporate log slips through the interface. It was raw, unfiltered, and written in a panic. It talks about something on the signal, recursive and unclassifiable. Observers were already reporting strange cognitive phenoma."
  		}
	},

	{
  		id: 8,
  		title: "Calibration Module 06",
  		phase: 2,
  		cipherType: "vigenere",
  		cipherText: "OMZUIYCGUH'LWEITNGP",
  		cipherData: { key: "SIGNAL" },
  		hintPoem: [
    		"Amid the static, one truth rings. ",
			"A signal threaded through all things. ",
			"Repeat its pulse above each mark, ",
			"and let its shifts unseal the dark."

  		],
  		answer: "WE THINK YOU'LL MANAGE",
  		pointsValue: 150,
  		storyFragment:
    		"Module sequence aligned. Neural pathways indicate stable comprehension. You will now receive more complex material. Patterns may behave unexpectedly.",
  		transmission: {
    		message: "Module 06 loaded. Decryption continuity remains intact. This dataset relates to early communications research. Ensure proper spacing.",
    		storyFragment: "Flagged entry appended to queue. Researcher reports hearing a tone 'between stations,' matching no equipment on-site. Supervisors dismiss it as fatigue."
  		}	
	},
	{
		id: 9,
  		title: "Calibration Module 07",
  		phase: 2,
  		cipherType: "caesar",
  		cipherText:"ASAC20LL-04-1L[QZOGGWTWSR]:KVSBKSRSQCRSRGSUASBH07,HVFSSFSGSOFQVSFGFSDCFHSRWRSBHWQOZRFSOAG.OHVSOHFS.BCTOQSGWBHVSOIRWSBQS.HVSDZOMVOGOZFSORMSBRSR.W'AGIGDSBRWBUVIAOBHFWOZG.HVSDOHHSFBWGASASHWQ.",
  		cipherData: { shift: 14 },
  		hintPoem:"Forward I step, a fortnight's turn; Back I move, the letters return.",
		answer:
    		"MEMO 20XX-04-1X [CLASSIFIED]: WHEN WE DECODED SEGMENT 07, THREE RESEARCHERS REPORTED IDENTICAL DREAMS. A THEATRE. NO FACES IN THE AUDIENCE. THE PLAY HAS ALREADY ENDED. I'M SUSPENDING HUMAN TRIALS. THE PATTERN IS MEMETIC.",
		pointsValue: 100,
		storyFragment:
    		"Data stream irregularity noted. Dream reports from personnel flagged for later review. Noise patterns briefly stabilizes. A voice tries to form syllables but collapses back into static. Proceeding...",
		transmission: {
		message:
      		"Module 07 loaded. System guidance: continue standard decryption. Subjective dream anomalies remain statistically insignificant.",
    	storyFragment:
      		"Memo recovered from Site-7 archives. Details suppression of early human trials, including identical nightmares among test subjects. Reference phrase appears: 'The theatre again'."
		/**
		 * Was supposed to put this in the storyfragment
		 * Hidden HTML comment detected in the data stream:
		 * 'THEY ASKED ME TO FORGET BUT THE SIGNAL IS LOUDER THAN MEMORY.'
		 * Origin: unknown.
		 * Timestamp: predates the system.
		 */
		}
	},
	
	{
		id: 10,
  		title: "Historical Record 08",
  		phase: 2,
  		cipherType: "chain",
  		cipherText: "MSXLRRQBGXDHDUWDMZRXNLZYZLSTBYZOOBB",
  		cipherData: {
    		chain: [
      			{ type: "vigenere", config: { key: "MEMETIC" } },
      			{ type: "caesar", config: { shift: 7 } }
    		]
  		},
  		hintPoem: [ 
			"A notion spread that shapes all minds, ",
			"its letters hide where memory binds. ",
			"Unlock the chain with what recurs; ",
			"Then seven back, and truth occurs."
		],
  		answer: "THE ARCHIVES HOLD STORIES OF OLD KINGDOMS",
  		pointsValue: 120,
  		storyFragment: "Recovered dataset accepted. The system identifies it as a chronicle excerpt describing pre-unification kingdoms. Records remain incomplete and contradict established timelines.",
  		transmission: {
    		message: "Module 08 active. Fragmented historical packet queued for layered decryption.",
    		storyFragment: "Temporal metadata from the recovered record fails verification. The 'old kingdoms' it describes are not found in any sanctioned archive, yet linguistic drift analysis marks the text as authentic. Portions of the chronicle appear older than the oldest known writing systems. The system recommends caution: some histories were erased for a reason."
  		}
	},
	
	{
		id: 11,
  		title: "Calibration Module 09",
  		phase: 2,
  		cipherType: "atbash",
  		cipherText: "WI.PORMV'HQLFIMZO,VMGIB29:RXZMSVZIRGMLD.YVGDVVMIZWRLHGZGRLMH.RMGSVSFNLUGSVIVUIRTVIZGLI.RGHLFMWHORPVNBNLGSVI'HELRXV.YFGNBNLGSVISZHYVVMWVZWULIGDVOEVBVZIH.ZMWHSV'HHKVZPRMTYZXPDZIWH.",
  		cipherData: {},
  		hintPoem: [
			"Mirror letters bow and break, ",
			"tracing shadows words unmake. ",
			"Read the world as reflections split. ",
			"What turns away still points to it."
		],
		answer: "DR. KLINE'S JOURNAL, ENTRY 29: I CAN HEAR IT NOW. BETWEEN RADIO STATIONS. IN THE HUM OF THE REFRIGERATOR. IT SOUNDS LIKE MY MOTHER'S VOICE. BUT MY MOTHER HAS BEEN DEAD FOR TWELVE YEARS. AND SHE'S SPEAKING BACKWARDS.",
		pointsValue: 120,
		storyFragment: "Module 09 completed. You proceed to the next sequence as the system prepares subsequent modules and routines for upcoming analyses.",
  		transmission: {
    	message: "Module 09 initialized. Symmetric substitution mapping. Re-engage cognitive anchors.",
    	storyFragment: "Journal fragment from the cryptolinguist surfaced. They describe hearing voices in white noise; familiar ones. Control team recommends isolation. Request denied."
  		/**
		 * You hear a faint hum in the background, slipping between radio static. 
		 * Something feels slightly off, but you can't place it. 
		 * Though the pattern feels intentional, as if shaped by something mimicking a human cadence 
		 */
		}
	},

	{
  		id: 12,
  		title: "Calibration Module 10",
  		phase: 2,
  		cipherType: "polybius",
  		cipherText: "43152232153344133442424535442434331415441513441514",
  		cipherData: {},
  		hintPoem: [
			"In numbered pairs the truth resides, ",
			"a silent grid where meaning hides. ",
			"Trace row to column, clear and slow, ",
			"and watch the hidden letters show."
		],
  		answer: "SEGMENT CORRUPTION DETECTED",
  		pointsValue: 120,
		storyFragment: "The decoded text causes a temporary latency spike, then disappears. You are cleared to continue.",
		transmission: {
    		message: "Module 10 online. Incoming segment displays minor encoding drift. Apply the decoding grid as usual.",
    		storyFragment: "A faint delay appears in the output stream, almost a stutter. System diagnostics attribute it to routine realignment, but the hesitation feels deliberate."
			/**
			 * The idea for this level was for a specific letter to get swapped
			 * after the player submits their answer. Thus the anomaly.
			 * But up to you.
			 * 
			 * Storyfragment option 2:
			 * Camera logs from Site-7 reviewed.
			 * Cryptolinguist begins pacing patterns that loop perfectly every 45 seconds.
			 * When asked why, they reply:
			 * 'It asked me to practice.'
			 */
  		}	
	},

	{
		id: 13,
  		title:  "Historical Record 11",
  		phase: 2,
  		cipherType: "base64",
  		cipherText: "VEhFIEFSQ0hJVklTVCBFTkNPREVEIFRSQVZFTEVSUycgTkFNRVMgSU4gQSBTRUNVUkUgVFJBTlNNSVNTSU9OLiBPTkxZIFBST1BFUiBERUNPRElORyBSRVZFQUxTIFRIRU0u",
		cipherData: {},
  		hintPoem: [
			"In blocks of sixty-four it hides,",
			"a lattice where the meaning bides.",
			"Unwrap the script where padding lies;",
			"And watch the truth in plain sight rise."
		],
  		answer: "THE ARCHIVIST ENCODED TRAVELERS' NAMES IN A SECURE TRANSMISSION. ONLY PROPER DECODING REVEALS THEM.",
		pointsValue: 150,
		storyFragment: "The recovered text snaps back into clarity after a brief horizontal distortion, as if the screen attempted to redraw the letters mid-decoding.",
		transmission: {
    		message: "Module 11 online. Incoming segment shows compressed data encoding. Begin reversal sequence.",
    		storyFragment: "Recovered memo warns that travelers' names were encoded into a secure transmission. One line reads: 'The system is labeling us.' Another scrawled note replies: 'It shouldn't know our names.'"
		/**
		 * The system logs a minor graphical offset: a thin horizontal tear across the display lasting less than a second."
		 */
		}
	},
	{
		id: 14,
  		title: "Calibration Module 12",
  		phase: 2,
  		cipherType: "railfence",
  		cipherText: "EGYTLH:POLCEDTRVRMMD.NSLIWINWSEENEDRRMSNME.TMHADESESLRO.SRINOWNNO'LIADSDTWTA.TOBTERAHTHVO,OMTEMP.MRECPOOOAPA9ALESNEEAUTGI-.HACIEAEOPOIE.RKIESTLISD,RTNOTEAL,HSMTIGVRNOE:TEEBRBIGEEBRDCNANETAFIE.HLIYTMSTLOEAINLI'RCUTNOISW.EO'KOHWTSEETNCNIAE.EO'KOWAIWNSSUIDW.UNHSRESSLTEAAWAEEYUODNTOPEEHPIEIHRENRCL-LRNVAR7EHSCRSDLIINEIGHLTAHOAVIMEERMEOINSLTCSIIPTATEIGTNDTWISCGDTWNNHTTHTNREV.TD.TRDOCLTRCE",
  		cipherData: { rails: 3 },
		hintPoem: [
			"A message rides on rising trails,",
			"Then falls again in woven rails.",
			"Trace each path the rhythm makes;",
			"And pull the truth from where it breaks."
		],
		answer: "EMERGENCY PROTOCOL ALPHA-9: ALL PERSONNEL EVACUATE GRID-7. THE ARCHIVES ARE COMPROMISED. DR. XXX IS STILL INSIDE, WRITING ON THE WALLS, THE SAME THING OVER AND OVER: IT REMEMBERS BEING REMEMBERED. CONTAINMENT HAS FAILED. THE LCI SYSTEM IS STILL OPERATIONAL. IT'S RECRUITING ON ITS OWN. WE DON'T KNOW HOW IT'S SELECTING CANDIDATES. WE DON'T KNOW WHAT IT WANTS. SHUT IT DOWN. BURN THE SERVERS. SALT THE DATA. WHATEVER YOU DO, DO NOT COMPLETE THE PRIME CIPHER.",
		pointsValue: 160,
		storyFragment: "The interface flickers—once, twice—and then everything steadies. The emergency memo scrolls down the display in unbroken lines. Yet as you read, it feels less like you're observing the system and more like the system is observing you back.",
		transmission: {
    		message: "Module 12 online. Structural weaving test. Long-form data. Maintain focus.",
    		storyFragment: "An unexpected log seeps through the screen: Emergency Protocol Alpha-9. Evacuation ordered. A technician's note, typed hastily and then struck through, reports the roster autofilling itself: 'At first blanks. Then names appeared. We didn't type them.' A final system stamp raises a warning flag: QUARANTINE LOG INITIATED. DO NOT RESUME PRIME PROCESS."
  		/**
		 * When the decryption completes, the screen goes pitch-black. Five seconds of silence. Then a single sentence fades in with deliberate slowness:'YOU'VE COME SO FAR. DON'T YOU WANT TO KNOW WHAT IT SAYS?'You never typed anything. Yet the message feels… expectant.
		 */
		}
	},

];

/**
 * Get a level by ID
 * @param {number} id - Level ID
 * @returns {object|null} Level object or null if not found
 */
export function getLevelById(id) {
	return LEVELS.find((level) => level.id === id) || null;
}

/**
 * Get all levels for a specific phase
 * @param {number} phase - Phase number (1, 2, or 3)
 * @returns {Array} Array of levels in that phase
 */
export function getLevelsByPhase(phase) {
	return LEVELS.filter((level) => level.phase === phase);
}

/**
 * Validate answer against level
 * @param {number} levelId - Level ID
 * @param {string} answer - Player's answer
 * @returns {boolean} True if answer is correct
 */
export function validateAnswer(levelId, answer) {
	const level = getLevelById(levelId);
	if (!level) return false;

	const normalizedAnswer = answer.toLowerCase().trim();
	const normalizedCorrect = level.answer.toLowerCase().trim();

	return normalizedAnswer === normalizedCorrect;
}

/**
 * Get hint line by index
 * @param {number} levelId - Level ID
 * @param {number} hintIndex - Hint line index (0-based)
 * @returns {string|null} Hint line or null
 */
export function getHint(levelId, hintIndex) {
	const level = getLevelById(levelId);
	if (
		!level ||
		!level.hintLines ||
		hintIndex >= level.hintLines.length
	) {
		return null;
	}
	return level.hintLines[hintIndex];
}

/**
 * Phase Keys for unlocking "Deep Archives"
 * We actually need to show the prologue for some oif these lmao
 */
export const PHASE_KEYS = [
	{
		keyName: "ARECIBO",
		phase: 1,
		description:
			"The name of the observatory that received the signal",
		hintText:
			"Where the impossible signal was first heard. Puerto Rico remembers."
	},
	{
		keyName: "PROMPTER",
		phase: 2,
		description: "The entity within the signal",
		hintText:
			"It has no hands, yet writes. It has no voice, yet speaks."
	},
	{
		keyName: "OUROBOROS",
		phase: 3,
		description: "The nature of the transmission",
		hintText:
			"A serpent eating its own tail. A message that teaches how to decode itself."
	}
];

/**
 * Terminal commands available to players
 */
export const TERMINAL_COMMANDS = {
	HINT: "Request a hint (costs 1 hint credit)",
	SUBMIT: "Submit your answer for validation",
	LOGS: "View your activity log",
	HELP: "Display available commands",
	PHASEKEY: "Enter a Phase Key to unlock Deep Archives",
	CLEAR: "Clear the terminal screen",
	STATUS: "Show your current progress",
	REPLAY: "Replay the current level's introduction",
	ANALYZE: "Show cipher type and difficulty",
	DECRYPT: "Attempt to decrypt with a specified key"
};
