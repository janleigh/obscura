import { useEffect, useState } from "react";
import { clearSession, getSession, saveSession } from "../utils/session";

/**
 * Hook for managing user session state
 * im tired now its been 3 hours and i wanna close my eyes
 * i wanna fall asleep cause i dont miss my baby
 * wtf?
 * @return {Object} session state and handlers
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
