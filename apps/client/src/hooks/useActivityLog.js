import { useCallback, useEffect, useRef, useState } from "react";

export const useActivityLog = (maxLogs = 50) => {
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

	// auto-scroll to bottom
	// biome-ignore lint/correctness/useExhaustiveDependencies: logs is the only dependency we want
			useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [logs]);

	return { logs, addLog, clearLogs, logEndRef };
};
