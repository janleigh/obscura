import { useEffect, useState } from "react";

export const useTypingEffect = (text, speed = 30, enabled = true) => {
	const [displayedText, setDisplayedText] = useState(
		enabled ? "" : text
	);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isComplete, setIsComplete] = useState(!enabled);

	useEffect(() => {
		if (!enabled) {
			setDisplayedText(text);
			setIsComplete(true);
			return;
		}

		setCurrentIndex(0);
		setDisplayedText("");
		setIsComplete(false);
	}, [text, enabled]);

	useEffect(() => {
		if (!enabled || currentIndex >= text.length) {
			if (currentIndex >= text.length) {
				setIsComplete(true);
			}
			return;
		}

		const timer = setTimeout(() => {
			setDisplayedText(text.substring(0, currentIndex + 1));
			setCurrentIndex((prev) => prev + 1);
		}, speed);

		return () => clearTimeout(timer);
	}, [currentIndex, text, speed, enabled]);

	return { displayedText, isComplete, currentIndex };
};
