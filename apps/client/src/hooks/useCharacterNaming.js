import { useCallback, useState } from "react";

/**
 * Hook for managing character naming state
 * Handles:
 * - Character name storage
 * - Name reveal mechanic at level 21
 * - Personalized message generation
 */
export const useCharacterNaming = (initialName = null) => {
    const [characterName, setCharacterName] = useState(
        initialName || "CRYPTOLINGUIST"
    );
    const [hasRevealed, setHasRevealed] = useState(false);

    const setName = useCallback((name) => {
        if (name && name.trim()) {
            setCharacterName(name.toUpperCase());
        }
    }, []);

    const revealName = useCallback(() => {
        setHasRevealed(true);
    }, []);

    return {
        characterName,
        setName,
        hasRevealed,
        revealName
    };
};

/**
 * Generate personalized message based on character name and current level
 * @param {string} characterName - The chosen character name
 * @param {number} currentLevel - Current level number
 * @returns {string|null} Personalized message or null
 */
export const getCharacterMessage = (characterName, currentLevel) => {
    const name = characterName || "CRYPTOLINGUIST";

    const messages = {
        0: `Initializing system for ${name}...`,
        1: `${name}, welcome to the cipher analysis station.`,
        10: `Progress noted, ${name}. You are adapting well.`,
        20: `${name}, you approach a critical threshold.`,
        21: `Greetings, ${name}. We have been waiting for you to reach this moment.`,
        25: `${name}, the signal is almost clear. Continue...`,
        30: `${name}, you have proven yourself worthy. The truth awaits.`
    };

    // Check for exact match first
    if (messages[currentLevel]) {
        return messages[currentLevel];
    }

    // For levels after 21, use generic progression message
    if (currentLevel > 21) {
        return `${name}, the signal grows clearer. Continue your investigation.`;
    }

    return null;
};

/**
 * Check if current level should trigger name reveal
 * @param {number} currentLevel - Current level number
 * @returns {boolean} True if name reveal should trigger
 */
export const shouldRevealName = (currentLevel) => {
    return currentLevel >= 21;
};
