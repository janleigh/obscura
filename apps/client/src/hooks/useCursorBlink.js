import { useEffect, useState } from "react";

export const useCursorBlink = (interval = 500) => {
	const [showCursor, setShowCursor] = useState(true);

	useEffect(() => {
		const cursorInterval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, interval);
		return () => clearInterval(cursorInterval);
	}, [interval]);

	return showCursor;
};
