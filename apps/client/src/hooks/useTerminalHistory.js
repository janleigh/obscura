import { useCallback, useEffect, useRef, useState } from "react";

export const useTerminalHistory = (initialHistory = []) => {
	const [history, setHistory] = useState(initialHistory);
	const historyEndRef = useRef(null);

	const addEntry = useCallback((type, text) => {
		setHistory((prev) => [...prev, { type, text }]);
	}, []);

	const clearHistory = useCallback(() => {
		setHistory([
			{
				type: "system",
				text: "Terminal cleared."
			}
		]);
	}, []);

	// Auto-scroll to bottom
	useEffect(() => {
		historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [history]);

	return { history, addEntry, clearHistory, historyEndRef };
};
