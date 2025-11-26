import axios from "axios";
import { useState } from "react";
import { CIPHER_DELAYS } from "../../../../packages/shared/cipherUtils";
import { API_ENDPOINTS } from "../config/api";

export const useCipherOperations = (addLog) => {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState("");
	const [error, setError] = useState("");

	const decrypt = async (cipherText, selectedCipher, config = {}) => {
		if (!cipherText.trim() && selectedCipher !== "steganography") {
			setError("Enter cipher text to decrypt");
			setResult("");
			addLog("ERROR", "No input provided");
			return;
		}

		addLog("INFO", `Starting ${selectedCipher} operation...`);
		setIsLoading(true);
		setError("");
		setResult("");

		await new Promise((resolve) => setTimeout(resolve, 200));
		addLog("SCAN", "Loading cipher parameters...");

		try {
			const payload = {
				ciphertext: cipherText,
				cipherType: selectedCipher,
				config
			};

			await new Promise((resolve) =>
				setTimeout(resolve, CIPHER_DELAYS[selectedCipher] || 400)
			);
			addLog("DECODE", "Processing cipher algorithm...");

			await new Promise((resolve) => setTimeout(resolve, 300));
			addLog("NETWORK", "Sending decryption request to server...");

			const response = await axios.post(
				API_ENDPOINTS.CIPHER_DECRYPT,
				payload
			);

			await new Promise((resolve) => setTimeout(resolve, 250));
			addLog("DECODE", "Parsing server response...");

			if (response.data.plaintext !== undefined) {
				setResult(response.data.plaintext);
				addLog(
					"SUCCESS",
					`Decryption successful! ${response.data.decryptedLength} chars recovered`
				);
			} else if (response.data.error) {
				setError(response.data.error);
				addLog("ERROR", response.data.error);
			} else {
				setError("Decryption failed");
				addLog("ERROR", "Unknown decryption failure");
			}
		} catch (err) {
			console.error("Decryption error:", err);
			const errorMsg =
				err.response?.data?.message ||
				"Failed to decrypt. Check your input and try again.";
			setError(errorMsg);
			addLog("CRITICAL", errorMsg);
		} finally {
			setIsLoading(false);
		}
	};

	const clearResults = () => {
		setResult("");
		setError("");
	};

	return {
		isLoading,
		result,
		error,
		setIsLoading,
		setResult,
		setError,
		decrypt,
		clearResults
	};
};
