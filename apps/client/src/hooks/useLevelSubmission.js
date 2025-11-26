import axios from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";

export const useLevelSubmission = (
	userData,
	currentLevel,
	onUserDataUpdate
) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState(null);

	const submitAnswer = async (answer) => {
		if (!answer.trim() || isSubmitting) return;

		if (!userData?.userId) {
			setMessage({
				type: "error",
				text: "Error: User session invalid. Please refresh the page."
			});
			return;
		}

		setIsSubmitting(true);
		setMessage(null);

		try {
			const response = await axios.post(
				API_ENDPOINTS.LEVEL_SUBMIT(currentLevel),
				{
					userId: userData.userId,
					answer: answer.trim()
				}
			);

			const { correct, storyFragment, transmission, nextLevelId } =
				response.data;

			if (correct) {
				setMessage({
					type: "success",
					text: "✓ CIPHER DECRYPTED!"
				});

				// Show story fragment before proceeding
				if (storyFragment) {
					setTimeout(() => {
						setMessage({
							type: "story",
							text: storyFragment,
							transmission: transmission?.message
						});
					}, 1500);
				}

				if (onUserDataUpdate) {
					onUserDataUpdate({
						...userData,
						currentLevel: nextLevelId,
						completedLevels: [
							...(userData.completedLevels || []),
							currentLevel
						]
					});
				}

				// Clear for the next level
				setTimeout(() => {
					setMessage(null);
				}, 5000);
			} else {
				setMessage({
					type: "error",
					text: "✗ INCORRECT. Try again."
				});
			}
		} catch (error) {
			console.error("Failed to submit answer:", error);
			setMessage({
				type: "error",
				text:
					error.response?.data?.error ||
					"Failed to submit answer"
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return { isSubmitting, message, submitAnswer, setMessage };
};
