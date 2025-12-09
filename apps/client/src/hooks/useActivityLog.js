import { useCallback, useEffect, useRef, useState } from "react";

export const useActivityLog = (maxLogs = 50, isActive = true) => {
	const [logs, setLogs] = useState([]);
	const logEndRef = useRef(null);

	const addLog = useCallback(
		(type, message) => {
			const timestamp = new Date().toLocaleTimeString();
			setLogs((prev) =>
				[...prev, { type, message, timestamp }].slice(-maxLogs)
			);
		},
		[maxLogs]
	);

	const clearLogs = useCallback(() => {
		setLogs([]);
	}, []);

	// auto-scroll to bottom only when tab is active
	// biome-ignore lint/correctness/useExhaustiveDependencies: logs and isActive are the dependencies we want
			useEffect(() => {
		if (isActive) {
			logEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [logs, isActive]);

	return { logs, addLog, clearLogs, logEndRef };
};
