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

	// Auto-scroll to bottom
	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [logs]);

	return { logs, addLog, clearLogs, logEndRef };
};
