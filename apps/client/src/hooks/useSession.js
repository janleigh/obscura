import { useEffect, useState } from "react";
import { clearSession, getSession, saveSession } from "../utils/session";

/**
 * Hook for managing user session state
 */
export const useSession = () => {
	const [session, setSession] = useState(null);

	useEffect(() => {
		const currentSession = getSession();
		setSession(currentSession);
	}, []);

	const updateSession = (newData) => {
		saveSession(newData);
		setSession(getSession());
	};

	const logout = () => {
		clearSession();
		setSession(null);
	};

	return {
		session,
		updateSession,
		logout,
		isLoggedIn: session !== null
	};
};
