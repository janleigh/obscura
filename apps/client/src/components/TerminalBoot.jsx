import { useEffect, useRef, useState } from "react";

const KERNEL_PHASE = 0;
const BOOT_PHASE = 1;
const LOGIN_PHASE = 2;

const TerminalBoot = ({ onBootComplete }) => {
	const [phase, setPhase] = useState(KERNEL_PHASE);
	const [bootLines, setBootLines] = useState([]);
	const [currentLineIndex, setCurrentLineIndex] = useState(0);
	const [showLogin, setShowLogin] = useState(false);
	const [username, setUsername] = useState("");
	const [showCursor, setShowCursor] = useState(true);
	const terminalRef = useRef(null);

	// Boot seqence messages
	// IIRC: It's inspired on Linux boot sequence where kernel-level then init messages
	// and I had to setup a VM to fact-check lmao
	// current theme is cold-war post-apocalyptic
	const kernelMessages = [
		{
			text: "[0000.000] OBSCURA CORE v6.7.3 — FIELD NODE: CRYPTONODE/COMMAND ROOT (POST-STRIKE BUILD)",
			color: "text-gray-400",
			delay: 50
		},
		{
			text: "[0000.000] EXEC LINE: /OBSCURA-KERNEL — STATUS: QUIET REBOOT, PARAM: CIPHER_MODE=INIT",
			color: "text-gray-400",
			delay: 40
		},
		{
			text: "[0000.000] PROCESSOR REPORT: VECTOR OPS RESTORED — FLOATING UNIT OPERATIONAL",
			color: "text-gray-400",
			delay: 30
		},
		{
			text: "[0000.000] PROCESSOR REPORT: STRATEGIC SIGNAL ENCODING ENABLED — SSE GRID ACTIVE",
			color: "text-gray-400",
			delay: 30
		},
		{
			text: "[0000.124] MEMORY ALLOCATION: 16.3G / 16.7G RECLAIMED FROM PRE-STRIKE CACHE",
			color: "text-gray-400",
			delay: 35
		},
		{
			text: "[0000.198] TIMING LOOP RECALIBRATION... 7200.00 UNITS — SYNCHRONIZATION RESTORED",
			color: "text-gray-400",
			delay: 40
		},
		{
			text: "[0000.367] CPU0: THERMAL CONTROL NOMINAL — CORE TEMPERATURE BELOW CRITICAL",
			color: "text-gray-400",
			delay: 35
		},
		{
			text: "[0000.489] CRYPTOGRAPHIC ENGINE: FIELD ACCELERATOR ONLINE — ENIGMA CIRCUIT STABLE",
			color: "text-gray-400",
			delay: 40
		},
		{
			text: "[0001.023] FILE SYSTEM: EXT4-MODE — ORDERED DATA CHANNEL MOUNTED",
			color: "text-gray-400",
			delay: 40
		},
		{
			text: "[0001.156] RANDOMIZER: ENTROPY POOL REBUILT — SOURCE: THERMONUCLEAR BACKGROUND",
			color: "text-gray-400",
			delay: 50
		}
	];

	const bootMessages = [
		{
			text: "         INITIALIZING DEVICE REGISTRY (SECTOR 9 RESTORATION PROTOCOL)...",
			color: "text-white",
			delay: 60
		},
		{
			text: "[ OK ] SUBSYSTEM: SWAP MEMORY RESTORED — FIELD STORAGE RECLAIMED.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "OK", color: "text-green-400" },
				{
					text: " ] SUBSYSTEM: SWAP MEMORY RESTORED — FIELD STORAGE RECLAIMED.",
					color: "text-white"
				}
			],
			delay: 55
		},
		{
			text: "[ OK ] DEVICE LINE: COLDSTART COMPLETE — HARDWARE CHANNELS RESPONSIVE.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "OK", color: "text-green-400" },
				{
					text: " ] DEVICE LINE: COLDSTART COMPLETE — HARDWARE CHANNELS RESPONSIVE.",
					color: "text-white"
				}
			],
			delay: 50
		},
		{
			text: "[ OK ] VARIABLE SHEET APPLIED — BASELINE DIRECTIVES REESTABLISHED.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "OK", color: "text-green-400" },
				{
					text: " ] VARIABLE SHEET APPLIED — BASELINE DIRECTIVES REESTABLISHED.",
					color: "text-white"
				}
			],
			delay: 55
		},
		{
			text: "[ OK ] NETWORK GRID RESTORED — PATHWAYS 1–7 CLEAR OF RADIATION.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "OK", color: "text-green-400" },
				{
					text: " ] NETWORK GRID RESTORED — PATHWAYS 1–7 CLEAR OF RADIATION.",
					color: "text-white"
				}
			],
			delay: 50
		},
		{
			text: "[ WARN ] SIGNAL ANOMALY DETECTED AT COORDINATE 0x7F3A2B91 — POSSIBLE GHOST TRANSMISSION.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "WARN", color: "text-yellow-300" },
				{
					text: " ] SIGNAL ANOMALY DETECTED AT COORDINATE 0x7F3A2B91 — POSSIBLE GHOST TRANSMISSION.",
					color: "text-white"
				}
			],
			delay: 70
		},
		{
			text: "[ OK ] CRYPTOLINK RESTORED — CHANNELS SEALED UNDER ALPHA-9 PROTOCOL.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "OK", color: "text-green-400" },
				{
					text: " ] CRYPTOLINK RESTORED — CHANNELS SEALED UNDER ALPHA-9 PROTOCOL.",
					color: "text-white"
				}
			],
			delay: 55
		},
		{
			text: "[ OK ] COMMAND SUBNET: ACTIVE — ALL FIELD NODES RESPONDING.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "OK", color: "text-green-400" },
				{
					text: " ] COMMAND SUBNET: ACTIVE — ALL FIELD NODES RESPONDING.",
					color: "text-white"
				}
			],
			delay: 60
		},
		{
			text: "[ OK ] TEMPORAL SYNC MODULE: LOCKED — DELTA TIME DEVIATION <0.02s.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "OK", color: "text-green-400" },
				{
					text: " ] TEMPORAL SYNC MODULE: LOCKED — DELTA TIME DEVIATION <0.02s.",
					color: "text-white"
				}
			],
			delay: 50
		},
		{
			text: "[ WARN ] UNAUTHORIZED TRANSMISSION — SOURCE UNDEFINED. HOLDING CHANNEL IN QUARANTINE.",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "WARN", color: "text-yellow-300" },
				{
					text: " ] UNAUTHORIZED TRANSMISSION — SOURCE UNDEFINED. HOLDING CHANNEL IN QUARANTINE.",
					color: "text-white"
				}
			],
			delay: 80
		},
		{
			text: "[ OK ] SESSION MANAGER ENGAGED — USER RECOGNIZED: FIELD OPERATIVE (CLEARANCE SIGMA).",
			color: "mixed",
			parts: [
				{ text: "[ ", color: "text-white" },
				{ text: "OK", color: "text-green-400" },
				{
					text: " ] SESSION MANAGER ENGAGED — USER RECOGNIZED: FIELD OPERATIVE (CLEARANCE SIGMA).",
					color: "text-white"
				}
			],
			delay: 55
		}
	];

	useEffect(() => {
		// TODO: Fix why is this on the far end
		// Cursor blink effect
		const cursorInterval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, 500);
		return () => clearInterval(cursorInterval);
	}, []);

	useEffect(() => {
		let sequence =
			phase === KERNEL_PHASE ? kernelMessages : bootMessages;

		if (phase === LOGIN_PHASE) {
			setBootLines([]);
			setShowLogin(true);
			return;
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
					setBootLines([]);
					setCurrentLineIndex(0);
					setPhase(LOGIN_PHASE);
				}, 700);
			}
		}
	}, [currentLineIndex, phase]);

	// Autoscroll effect duh. You can't scroll on the tty.
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop =
				terminalRef.current.scrollHeight;
		}
	}, [bootLines, showLogin]);

	const handleLogin = (e) => {
		e.preventDefault();
		if (username.trim()) {
			setBootLines([
				{ text: "", color: "", delay: 0 },
				{
					text: `Authenticating user: ${username}...`,
					color: "mixed",
					parts: [
						{
							text: "Authenticating user: ",
							color: "text-white"
						},
						{ text: username, color: "text-cyan-400" },
						{ text: "...", color: "text-white" }
					],
					delay: 0
				},
				{
					text: "         WELCOME BACK, OPERATIVE. SYSTEM: OBSCURA [LINGUALIS-Σ] REINITIALIZED.",
					color: "mixed",
					parts: [
						{
							text: "WELCOME BACK, OPERATIVE. ",
							color: "text-white"
						},
						{
							text: "SYSTEM: OBSCURA",
							color: "text-cyan-400"
						},
						{ text: " [", color: "text-white" },
						{ text: "LINGUALIS", color: "text-yellow-300" },
						{ text: "-", color: "text-white" },
						{ text: "Σ", color: "text-green-400" },
						{ text: "] REINITIALIZED.", color: "text-white" }
					],
					delay: 300
				}
			]);
			setShowLogin(false);
			setTimeout(() => {
				onBootComplete?.(username);
			}, 1500);
		}
	};

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
				{/* Login prompt */}
				{showLogin && (
					<div className="mt-4">
						{/* Welcome message above login */}
						<div className="mb-2">
							{/* Render the mixed color welcome message */}
							{[
								{
									text: "WELCOME BACK, OPERATIVE. ",
									color: "text-white"
								},
								{
									text: "SYSTEM: OBSCURA",
									color: "text-cyan-400"
								},
								{ text: " [", color: "text-white" },
								{
									text: "LINGUALIS",
									color: "text-yellow-300"
								},
								{ text: "-", color: "text-white" },
								{ text: "Σ", color: "text-green-400" },
								{
									text: "] REINITIALIZED.",
									color: "text-white"
								}
							].map((part, idx) => (
								<span key={idx} className={part.color}>
									{part.text}
								</span>
							))}
						</div>
						<form
							onSubmit={handleLogin}
							className="flex items-center">
							<span className="font-kode-mono mr-2 text-white">
								login:
							</span>
							<div className="flex flex-1 items-center">
								<input
									type="text"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									className="w-full border-none bg-transparent text-white caret-white outline-none"
									autoFocus
									maxLength={32}
								/>
								<span className="ml-2">
									{showCursor && (
										<span className="animate-pulse text-white">
											█
										</span>
									)}
								</span>
							</div>
						</form>
					</div>
				)}
				{/* Blinking cursor during boot */}
				{!showLogin &&
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
