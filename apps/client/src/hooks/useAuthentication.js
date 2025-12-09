import axios from "axios";
import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { saveSession } from "../utils/session";

export const useAuthentication = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const login = async (username, password) => {
		if (!username.trim() || !password) return null;

		setIsLoading(true);
		setError(null);

		try {
			const response = await axios.post(API_ENDPOINTS.GAME_START, {
				username: username.trim(),
				password: password
			});

			const userData = response.data;

			if (userData.userId) {
				saveSession(userData);
				return { success: true, userData };
			} else {
				setError("Unexpected server response");
				return { error: "Unexpected server response" };
			}
		} catch (err) {
			console.error("Login error:", err);
			const errorMsg =
				err.response?.data?.error || "Connection failed";
			setError(errorMsg);
			return { error: errorMsg };
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (username, realName, password) => {
		if (!realName.trim() || !password) return null;

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return { error: "Password must be at least 8 characters" };
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await axios.post(API_ENDPOINTS.GAME_START, {
				username: username.trim(),
				realName: realName.trim(),
				password: password,
				mode: "register"
			});

			const userData = response.data;
			saveSession(userData);
			return { success: true, userData };
		} catch (err) {
			console.error("Registration error:", err);
			const errorMsg =
				err.response?.data?.error || "Failed to connect to server";
			setError(errorMsg);
			return { error: errorMsg };
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, error, setError, login, register };
};
