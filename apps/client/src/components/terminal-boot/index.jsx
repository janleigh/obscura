import { useEffect, useMemo, useRef, useState } from "react";
import {
	bootMessages,
	getAuthMessages,
	kernelMessages
} from "../../../../../packages/ui/bootMessages";
import { useCursorBlink } from "../../hooks/useCursorBlink";
import { useSound } from "../../hooks/useSound";
import CRTEffects from "../shared/CRTEffects";
import BootMessage from "./BootMessage";

const KERNEL_PHASE = 0;
const BOOT_PHASE = 1;
const AUTO_LOGIN_PHASE = 2;

const ASCII_LOGO = `
   ____  ____  ___  ___ _   _ ____    _    
  / _ \\| __ )/ _ \\/ __| | | |  _ \\  / \\   
 | | | |  _ \\ (_) \\__ \\ | | | |_) |/ _ \\  
 | |_| | |_) \\__, |___/ |_| |  _ < / ___ \\ 
  \\___/|____/  /_/|___/\\___/|_| \\_/_/   \\_\\
`;

const MemoryCheck = () => {
	const [mem, setMem] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setMem((m) => {
				if (m >= 65536) {
					clearInterval(interval);
					return 65536;
				}
				return m + 892;
			});
		}, 20);
		return () => clearInterval(interval);
	}, []);

	return <span>RAM SYSTEM CHECK: {mem} KB OK</span>;
};

const TerminalBoot = ({ userData, onBootComplete }) => {
	const [phase, setPhase] = useState(KERNEL_PHASE);
	const [bootLines, setBootLines] = useState([]);
	const [currentLineIndex, setCurrentLineIndex] = useState(0);
	const terminalRef = useRef(null);
	const showCursor = useCursorBlink(500);
	const { playSound } = useSound();

	const authMessages = useMemo(() => {
		const username = userData?.username || "candidate";
		return getAuthMessages(username);
	}, [userData]);

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
					setPhase(AUTO_LOGIN_PHASE);
				}, 700);
			} else if (phase === AUTO_LOGIN_PHASE) {
				setTimeout(() => {
					// Play bootup sound when terminal loading is complete
					playSound("bootup");
					const username = userData?.username || "candidate";
					onBootComplete?.(username);
				}, 800);
			}
		}
	}, [
		currentLineIndex,
		phase,
		userData,
		onBootComplete,
		authMessages,
		playSound
	]);
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop =
				terminalRef.current.scrollHeight;
		}
	}, [bootLines]);

	return (
		<div className="font-kode-mono fixed inset-0 overflow-hidden bg-[#0a0a0a] text-sm text-[#f0f0f0] selection:bg-[#f0f0f0] selection:text-[#0a0a0a]">
			<div
				ref={terminalRef}
				className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800 crt-glow h-full w-full overflow-y-auto p-8 flex flex-col gap-1">
				<div className="mb-6 select-none opacity-80">
					<pre className="text-green-500 font-bold leading-none tracking-tighter">
						{ASCII_LOGO}
					</pre>
				</div>

				<div className="mb-6 border-b border-gray-800 pb-4 text-xs text-gray-500">
					<div className="flex justify-between">
						<span>OBSCURA BIOS v2.19.5 (RELEASE)</span>
						<MemoryCheck />
					</div>
					<div className="flex justify-between mt-1">
						<span>COPYRIGHT (C) 2019 THE OBSCURA COLLECTIVE</span>
						<span>CPU: QUANTUM-CORE @ 4.20GHz</span>
					</div>
				</div>

				{bootLines.map((line, index) => (
					<BootMessage key={index} line={line} />
				))}
				{phase !== AUTO_LOGIN_PHASE &&
					currentLineIndex >= bootLines.length &&
					showCursor && (
						<span className="crt-glow text-white">█</span>
					)}
			</div>
			<CRTEffects />
		</div>
	);
};

export default TerminalBoot;
