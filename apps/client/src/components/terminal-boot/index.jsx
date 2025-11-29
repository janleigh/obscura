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
}, [currentLineIndex, phase, userData, onBootComplete, authMessages, playSound]);	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop =
				terminalRef.current.scrollHeight;
		}
	}, [bootLines]);

	return (
		<div className="font-kode-mono fixed inset-0 overflow-hidden bg-[#0a0a0a] text-sm">
			<div
				ref={terminalRef}
				className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800 crt-glow h-full w-full overflow-y-auto p-4">
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
