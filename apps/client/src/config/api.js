// Base URL for API requests
export const API_BASE_URL = "http://localhost:3000";

// API endpoints
export const API_ENDPOINTS = {
	GAME_START: `${API_BASE_URL}/api/game/start`,
	LEVEL_GET: (id) => `${API_BASE_URL}/api/level/${id}`,
	LEVEL_SUBMIT: (id) => `${API_BASE_URL}/api/level/${id}/submit`,
	LEVEL_HINT: (id) => `${API_BASE_URL}/api/level/${id}/hint`,
	PLAYER_LOGS: (id) => `${API_BASE_URL}/api/player/${id}/logs`
};
