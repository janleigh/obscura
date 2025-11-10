import { useEffect, useMemo, useRef, useState } from "react";

const KERNEL_PHASE = 0;
const BOOT_PHASE = 1;
const AUTO_LOGIN_PHASE = 2;

const TerminalBoot = ({ userData, onBootComplete }) => {
	const [phase, setPhase] = useState(KERNEL_PHASE);
	const [bootLines, setBootLines] = useState([]);
	const [currentLineIndex, setCurrentLineIndex] = useState(0);
	const [showCursor, setShowCursor] = useState(true);
	const terminalRef = useRef(null);

	// Boot seqence messages
	// IIRC: It's inspired on Linux boot sequence where kernel-level then init messages
	// and I had to setup a VM to fact-check lmao
	// check this for the narrative plot
	// https://docs.google.com/document/d/1kpae2FgEB76-Sb78P21JmXqwUqY5U7MQKbMK60k3AI4/edit?tab=t.0
	const kernelMessages = [
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

	const bootMessages = [
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

	// Build authentication messages with user data
	const authMessages = useMemo(() => {
		const username = userData?.username || "candidate";
		return [
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
				delay: 400
			},
			{
				text: "Authentication successful. Loading main interface...",
				color: "text-white",
				delay: 600
			}
		];
	}, [userData]);

	// Cursor blink effect
	useEffect(() => {
		const cursorInterval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, 500);
		return () => clearInterval(cursorInterval);
	}, []);

	useEffect(() => {
		let sequence;
		if (phase === KERNEL_PHASE) {
			sequence = kernelMessages;
		} else if (phase === BOOT_PHASE) {
			sequence = bootMessages;
		} else if (phase === AUTO_LOGIN_PHASE) {
			sequence = authMessages;
		}

		if (currentLineIndex < sequence.length) {
			const currentLine = sequence[currentLineIndex];
			const timer = setTimeout(() => {
				setBootLines((prev) => [...prev, currentLine]);
				setCurrentLineIndex((prev) => prev + 1);
			}, currentLine.delay);
			return () => clearTimeout(timer);
		} else {
			// Clear lines on every phase like how Linux does.
			if (phase === KERNEL_PHASE) {
				setTimeout(() => {
					setBootLines([]);
					setCurrentLineIndex(0);
					setPhase(BOOT_PHASE);
				}, 500);
			} else if (phase === BOOT_PHASE) {
				setTimeout(() => {
					setCurrentLineIndex(0);
					setPhase(AUTO_LOGIN_PHASE);
				}, 700);
			} else if (phase === AUTO_LOGIN_PHASE) {
				// All messages displayed, complete boot
				setTimeout(() => {
					const username = userData?.username || "candidate";
					onBootComplete?.(username);
				}, 800);
			}
		}
	}, [currentLineIndex, phase, userData, onBootComplete, authMessages]);

	// Autoscroll effect duh. You can't scroll on the tty.
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop =
				terminalRef.current.scrollHeight;
		}
	}, [bootLines]);

	return (
		<div className="font-kode-mono fixed inset-0 overflow-hidden bg-[#0a0a0a] text-sm">
			<div
				ref={terminalRef}
				className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800 h-full w-full overflow-y-auto p-4">
				{/* Boot messages */}
				{bootLines.map((line, index) => (
					<div key={index} className="leading-relaxed">
						{line.color === "mixed" ? (
							<>
								{line.parts.map((part, partIndex) => (
									<span
										key={partIndex}
										className={part.color}>
										{part.text}
									</span>
								))}
							</>
						) : (
							<span className={line.color}>
								{line.text || "\u00A0"}
							</span>
						)}
					</div>
				))}
				{/* Blinking cursor during boot */}
				{phase !== AUTO_LOGIN_PHASE &&
					currentLineIndex >= bootLines.length &&
					showCursor && <span className="text-white">█</span>}
			</div>
			{/* Scanline effect */}
			<div className="animate-scanline pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-[rgba(255,255,255,0.02)] to-transparent bg-size-[100%_4px] opacity-20"></div>
			{/* Vignette effect */}
			<div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
		</div>
	);
};

export default TerminalBoot;
