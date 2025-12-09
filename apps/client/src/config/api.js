// Base URL for API requests
export const API_BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

// API endpoints
export const API_ENDPOINTS = {
	HASH: `${API_BASE_URL}/hash`,
	GAME_START: `${API_BASE_URL}/api/game/start`,
	LEVEL_GET: (id) => `${API_BASE_URL}/api/game/level/${id}`,
	LEVEL_SUBMIT: (id) => `${API_BASE_URL}/api/game/level/${id}/submit`,
	LEVEL_HINT: (id) => `${API_BASE_URL}/api/game/level/${id}/hint`,
	PLAYER_LOGS: (id) => `${API_BASE_URL}/api/game/player/${id}/logs`,
	PHASE_KEY_SUBMIT: `${API_BASE_URL}/api/game/phasekey`,
	CIPHER_ENCRYPT: `${API_BASE_URL}/api/cipher/encrypt`,
	CIPHER_DECRYPT: `${API_BASE_URL}/api/cipher/decrypt`,
	CIPHER_TYPES: `${API_BASE_URL}/api/cipher/types`
};
