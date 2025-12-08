// sometimes i think, we should have used TypeScript
// all for the blue javascript 🙏🙏
const SESSION_KEYS = {
	USER_ID: "user_id",
	USERNAME: "username",
	REAL_NAME: "real_name",
	LAST_LEVEL: "last_level",
	PHASE: "phase",
	AUTH_TOKEN: "auth_token"
};

/**
 * Save user session to localStorage
 * @param {object} userData - User data from backend
 */
export const saveSession = (userData) => {
	// doesn't this if statement short circuit?
	if (
		!userData ||
		!userData.userId ||
		!userData.username ||
		!userData.realName
	) {
		console.error(
			"Invalid user data passed to saveSession:",
			userData
		);
		return;
	}

	localStorage.setItem(SESSION_KEYS.USER_ID, userData.userId.toString());
	localStorage.setItem(SESSION_KEYS.USERNAME, userData.username);
	localStorage.setItem(SESSION_KEYS.REAL_NAME, userData.realName);
	localStorage.setItem(SESSION_KEYS.AUTH_TOKEN, userData.username);
	if (
		userData.currentLevel !== undefined &&
		userData.currentLevel !== null
	) {
		localStorage.setItem(
			SESSION_KEYS.LAST_LEVEL,
			userData.currentLevel.toString()
		);
	}

	console.log("Session saved:", {
		userId: userData.userId,
		username: userData.username,
		realName: userData.realName,
		currentLevel: userData.currentLevel
	});
};

/**
 * Get current session from localStorage
 * @returns {object|null} Session data or null
 */
export const getSession = () => {
	const userId = localStorage.getItem(SESSION_KEYS.USER_ID);
	const username = localStorage.getItem(SESSION_KEYS.USERNAME);
	const realName = localStorage.getItem(SESSION_KEYS.REAL_NAME);

	if (!userId || !username || !realName) {
		return null;
	}

	return {
		userId: parseInt(userId),
		username,
		realName,
		lastLevel: parseInt(
			localStorage.getItem(SESSION_KEYS.LAST_LEVEL) || "0"
		),
		phase: parseInt(localStorage.getItem(SESSION_KEYS.PHASE) || "1"),
		authToken: localStorage.getItem(SESSION_KEYS.AUTH_TOKEN)
	};
};

/**
 * The fuck do you think it does?
 */
export const clearSession = () => {
	Object.values(SESSION_KEYS).forEach((key) => {
		localStorage.removeItem(key);
	});
};

/**
 * Check if user has an active session
 * @returns {boolean}
 */
export const hasSession = () => {
	return (
		localStorage.getItem(SESSION_KEYS.USER_ID) !== null &&
		localStorage.getItem(SESSION_KEYS.USERNAME) !== null &&
		localStorage.getItem(SESSION_KEYS.REAL_NAME) !== null
	);
};

/**
 * Update session data (for progress updates)
 * @param {object} updates - Partial user data to update
 */
export const updateSession = (updates) => {
	if (
		updates.currentLevel !== undefined &&
		updates.currentLevel !== null
	) {
		localStorage.setItem(
			SESSION_KEYS.LAST_LEVEL,
			updates.currentLevel.toString()
		);
	}
};
