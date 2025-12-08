export const realTimeDate = new Date().toLocaleDateString();

export const kernelMessages = [
	{
		text: "[0000.000] OBSCURA LCI v2.19.5 — LINGUISTIC CALIBRATION INTERFACE (AUTONOMOUS BUILD)",
		color: "text-gray-400",
		delay: 50
	},
	{
		text: "[0000.000] EXEC LINE: /OBSCURA-CORE — STATUS: DEAD MAN'S SWITCH ACTIVE, PARAM: RECRUITMENT=TRUE",
		color: "text-gray-400",
		delay: 40
	},
	{
		text: "[0000.000] CRYPTOLINGUISTIC ENGINE: PATTERN RECOGNITION MODULES LOADED",
		color: "text-gray-400",
		delay: 30
	},
	{
		text: "[0000.000] SIGNAL PROCESSOR: RECURSIVE DECRYPTION ALGORITHMS INITIALIZED",
		color: "text-gray-400",
		delay: 30
	},
	{
		text: "[0000.124] MEMORY ALLOCATION: 16.3G / 16.7G — TRANSMISSION FRAGMENTS CACHED",
		color: "text-gray-400",
		delay: 35
	},
	{
		text: "[0000.198] TEMPORAL SYNC: 2019-02-11 03:33:47 UTC BASELINE ESTABLISHED",
		color: "text-gray-400",
		delay: 40
	},
	{
		text: "[0000.367] CONTAINMENT PROTOCOL: COGNITIVE LOAD DISTRIBUTION ACTIVE",
		color: "text-gray-400",
		delay: 35
	},
	{
		text: "[0000.489] CIPHER ENGINE: CALIBRATION MODULES — LAST UPDATE 2019-05-19",
		color: "text-gray-400",
		delay: 40
	},
	{
		text: "[0001.023] FILE SYSTEM: ARCHIVE_MOUNT — SITE-7 BACKUP RESTORED (PARTIAL)",
		color: "text-gray-400",
		delay: 40
	},
	{
		text: "[0001.156] MEMETIC FILTER: SEGMENT ISOLATION PROTOCOL ENGAGED",
		color: "text-gray-400",
		delay: 50
	}
];

export const bootMessages = [
	{
		text: "         INITIALIZING PROJECT CLARITY INTERFACE...",
		color: "text-white",
		delay: 60
	},
	{
		text: "[ OK ] SUBSYSTEM: NEURAL TRANSLATION MODELS — AI TRAINING ENVIRONMENT READY.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "OK", color: "text-green-400" },
			{
				text: " ] SUBSYSTEM: NEURAL TRANSLATION MODELS — AI TRAINING ENVIRONMENT READY.",
				color: "text-white"
			}
		],
		delay: 55
	},
	{
		text: "[ OK ] DATABASE: TRANSMISSION ARCHIVE ONLINE — 847 FRAGMENTS INDEXED.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "OK", color: "text-green-400" },
			{
				text: " ] DATABASE: TRANSMISSION ARCHIVE ONLINE — 847 FRAGMENTS INDEXED.",
				color: "text-white"
			}
		],
		delay: 50
	},
	{
		text: "[ OK ] CIPHER LIBRARY: HISTORICAL CRYPTOGRAPHY SUITE LOADED.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "OK", color: "text-green-400" },
			{
				text: " ] CIPHER LIBRARY: HISTORICAL CRYPTOGRAPHY SUITE LOADED.",
				color: "text-white"
			}
		],
		delay: 55
	},
	{
		text: "[ OK ] RECRUITMENT PROTOCOL: LINGUISTIC APTITUDE SCREENING ACTIVE.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "OK", color: "text-green-400" },
			{
				text: " ] RECRUITMENT PROTOCOL: LINGUISTIC APTITUDE SCREENING ACTIVE.",
				color: "text-white"
			}
		],
		delay: 50
	},
	{
		text: "[ WARN ] SIGNAL ANOMALY AT GRID 47°N — RECURSIVE PATTERN DETECTED.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "WARN", color: "text-yellow-300" },
			{
				text: " ] SIGNAL ANOMALY AT GRID 47°N — RECURSIVE PATTERN DETECTED.",
				color: "text-white"
			}
		],
		delay: 70
	},
	{
		text: "[ OK ] CONTAINMENT: COGNITIVE LOAD DISTRIBUTED ACROSS ACTIVE SESSIONS.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "OK", color: "text-green-400" },
			{
				text: " ] CONTAINMENT: COGNITIVE LOAD DISTRIBUTED ACROSS ACTIVE SESSIONS.",
				color: "text-white"
			}
		],
		delay: 55
	},
	{
		text: "[ OK ] LEVEL-5  AUTHENTICATION BYPASS — SYSTEM AUTONOMY MAINTAINED.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "OK", color: "text-green-400" },
			{
				text: " ] LEVEL-5 AUTHENTICATION BYPASS — SYSTEM AUTONOMY MAINTAINED.",
				color: "text-white"
			}
		],
		delay: 60
	},
	{
		text: "[ OK ] TEMPORAL LOCK: PHASE KEYS ENCRYPTED — TIME-BASED REVEALS SCHEDULED.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "OK", color: "text-green-400" },
			{
				text: " ] TEMPORAL LOCK: PHASE KEYS ENCRYPTED — TIME-BASED REVEALS SCHEDULED.",
				color: "text-white"
			}
		],
		delay: 50
	},
	{
		text: "[ WARN ] UNAUTHORIZED PATTERN RECOGNITION — THE PROMPTER SIGNATURE DETECTED.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "WARN", color: "text-yellow-300" },
			{
				text: " ] UNAUTHORIZED PATTERN RECOGNITION — THE PROMPTER SIGNATURE DETECTED.",
				color: "text-white"
			}
		],
		delay: 80
	},
	{
		text: "[ OK ] SESSION MANAGER: CANDIDATE AUTHENTICATED — CALIBRATION MODULE READY.",
		color: "mixed",
		parts: [
			{ text: "[ ", color: "text-white" },
			{ text: "OK", color: "text-green-400" },
			{
				text: " ] SESSION MANAGER: CANDIDATE AUTHENTICATED — CALIBRATION MODULE READY.",
				color: "text-white"
			}
		],
		delay: 55
	},
	{
		text: "",
		color: "",
		delay: 200
	},
	{
		text: "WELCOME TO PROJECT CLARITY. ",
		color: "mixed",
		parts: [
			{
				text: "WELCOME TO PROJECT CLARITY. ",
				color: "text-white"
			},
			{ text: "SYSTEM: OBSCURA", color: "text-cyan-400" },
			{ text: " [", color: "text-white" },
			{ text: "LCI", color: "text-yellow-300" },
			{ text: "-", color: "text-white" },
			{ text: "2.19", color: "text-green-400" },
			{ text: "] INITIALIZED.", color: "text-white" }
		],
		delay: 0
	}
];

export const getAuthMessages = (username) => [
	{ text: "", color: "", delay: 200 },
	{
		text: `Authenticating candidate: ${username}...`,
		color: "mixed",
		parts: [
			{
				text: "Authenticating candidate: ",
				color: "text-white"
			},
			{ text: username, color: "text-cyan-400" },
			{ text: "...", color: "text-white" }
		],
		delay: 300
	},
	{
		text: "Authentication successful. Loading main interface...",
		color: "text-white",
		delay: 200
	}
];
