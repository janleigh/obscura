import axios from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";

export const useLevelSubmission = (
	userData,
	currentLevel,
	onUserDataUpdate,
	onShowStoryFragment
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
					text: "CIPHER DECRYPTED!"
				});

				// Show story fragment before proceeding to next level
				if (storyFragment && onShowStoryFragment) {
					setTimeout(() => {
						setMessage(null);
						onShowStoryFragment(storyFragment);

						// Update user data after story fragment starts showing
						setTimeout(
							() => {
								if (onUserDataUpdate) {
									onUserDataUpdate({
										...userData,
										currentLevel: nextLevelId,
										completedLevels: [
											...(userData.completedLevels ||
												[]),
											currentLevel
										]
									});
								}
							},
							storyFragment.length * 20 + 1000
						);
					}, 1500);
				} else {
					// No story fragment, proceed directly
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
					setTimeout(() => setMessage(null), 3000);
				}
			} else {
				setMessage({
					type: "error",
					text: "INCORRECT. Try again."
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
