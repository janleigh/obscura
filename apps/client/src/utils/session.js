const SESSION_KEYS = {
	USER_ID: "user_id",
	USERNAME: "username",
	REAL_NAME: "real_name",
	LAST_LEVEL: "last_level",
	PHASE: "phase"
};

/**
 * Save user session to localStorage
 * @param {object} userData - User data from backend
 */
export const saveSession = (userData) => {
	if (!userData || !userData.userId || !userData.username || !userData.realName) {
		console.error("Invalid user data passed to saveSession:", userData);
		return;
	}

	localStorage.setItem(SESSION_KEYS.USER_ID, userData.userId.toString());
	localStorage.setItem(SESSION_KEYS.USERNAME, userData.username);
	localStorage.setItem(SESSION_KEYS.REAL_NAME, userData.realName);
	if (userData.currentLevel) {
		localStorage.setItem(
			SESSION_KEYS.LAST_LEVEL,
			userData.currentLevel.toString()
		);
	}
	if (userData.phaseUnlocked) {
		localStorage.setItem(
			SESSION_KEYS.PHASE,
			userData.phaseUnlocked.toString()
		);
	}

	console.log("Session saved:", {
		userId: userData.userId,
		username: userData.username,
		realName: userData.realName,
		currentLevel: userData.currentLevel,
		phaseUnlocked: userData.phaseUnlocked
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
			localStorage.getItem(SESSION_KEYS.LAST_LEVEL) || "1"
		),
		phase: parseInt(localStorage.getItem(SESSION_KEYS.PHASE) || "1")
	};
};

/**
 * Clear session from localStorage
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
	if (updates.currentLevel) {
		localStorage.setItem(SESSION_KEYS.LAST_LEVEL, updates.currentLevel);
	}
	if (updates.phaseUnlocked) {
		localStorage.setItem(SESSION_KEYS.PHASE, updates.phaseUnlocked);
	}
};
