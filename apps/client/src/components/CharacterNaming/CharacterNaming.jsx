import { useEffect, useState } from "react";
import "./character-naming.css";

/**
 * CharacterNaming Component
 * Manages the cryptolinguist character identity system
 * Features:
 * - Character naming input
 * - Name reveal mechanic at level 21
 * - Personalized message display
 */
const CharacterNaming = ({
    userData,
    currentLevel,
    onCharacterNameSet,
    characterName: initialCharacterName
}) => {
    const [characterName, setCharacterName] = useState(
        initialCharacterName || "CRYPTOLINGUIST"
    );
    const [showNameReveal, setShowNameReveal] = useState(false);
    const [isNamingPhase, setIsNamingPhase] = useState(false);
    const [revealedName, setRevealedName] = useState(null);

    // Check if we've reached the name reveal level (21)
    const isNameRevealLevel = currentLevel >= 21;

    // Initialize naming phase on component mount or when userData changes
    useEffect(() => {
        // If user hasn't named the character yet, prompt at appropriate time
        if (!initialCharacterName && currentLevel < 21) {
            setIsNamingPhase(true);
        }
    }, [initialCharacterName, currentLevel]);

    // Handle name reveal at level 21
    useEffect(() => {
        if (isNameRevealLevel && !revealedName) {
            setTimeout(() => {
                setShowNameReveal(true);
                setRevealedName(characterName || "CRYPTOLINGUIST");
            }, 500);
        }
    }, [isNameRevealLevel, revealedName, characterName]);

    const handleNameSubmit = (e) => {
        if (e.key === "Enter") {
            const newName = (e.target.value || "CRYPTOLINGUIST").toUpperCase();
            setCharacterName(newName);
            setIsNamingPhase(false);

            // Call parent callback if provided
            if (onCharacterNameSet) {
                onCharacterNameSet(newName);
            }
        }
    };

    const handleNameChange = (e) => {
        setCharacterName(e.target.value.toUpperCase());
    };

    /**
     * Get personalized message based on character name and level
     */
    const getPersonalizedMessage = () => {
        const name = revealedName || characterName;

        if (currentLevel === 21) {
            return `Greetings, ${name}. We have been waiting for you to reach this moment.`;
        }

        if (currentLevel > 21) {
            return `${name}, the signal grows clearer. Continue your investigation.`;
        }

        return null;
    };

    const personalizedMessage = getPersonalizedMessage();

    return (
        <div className="character-naming-container">
            {/* Naming Phase - Early game */}
            {isNamingPhase && currentLevel < 21 && (
                <div className="character-naming-panel naming-phase">
                    <div className="naming-header">
                        <span className="text-xs font-bold tracking-wider text-green-400">
                            IDENTIFY YOURSELF
                        </span>
                    </div>
                    <div className="naming-content">
                        <p className="text-xs text-gray-400 mb-3">
                            What shall we call you, cryptographer?
                        </p>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Enter your cryptolinguist name..."
                            maxLength="30"
                            onKeyDown={handleNameSubmit}
                            onChange={handleNameChange}
                            value={characterName}
                            className="naming-input"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Press ENTER to confirm
                        </p>
                    </div>
                </div>
            )}

            {/* Display Current Character Name */}
            {!isNamingPhase && !showNameReveal && (
                <div className="character-naming-display">
                    <div className="character-name-badge">
                        <span className="text-xs text-gray-500">
                            OPERATOR:
                        </span>
                        <span className="character-name text-green-400">
                            {characterName || "CRYPTOLINGUIST"}
                        </span>
                    </div>
                </div>
            )}

            {/* Name Reveal - Level 21 and beyond */}
            {showNameReveal && isNameRevealLevel && (
                <div className="character-naming-panel name-reveal">
                    <div className="reveal-animation">
                        <div className="reveal-header">
                            <span className="text-xs font-bold tracking-wider text-cyan-400">
                                IDENTITY CONFIRMED
                            </span>
                        </div>
                        <div className="reveal-content">
                            <div className="revealed-name-display">
                                <p className="text-xs text-gray-400 mb-2">
                                    Signal source identity:
                                </p>
                                <div className="revealed-name">
                                    <span className="glitch" data-text={revealedName}>
                                        {revealedName}
                                    </span>
                                </div>
                            </div>

                            {/* Personalized Message */}
                            {personalizedMessage && (
                                <div className="personalized-message">
                                    <p className="text-xs text-yellow-600 italic">
                                        {personalizedMessage}
                                    </p>
                                </div>
                            )}

                            <div className="revelation-info">
                                <p className="text-xs text-gray-600 text-center">
                                    You have progressed to level {currentLevel}
                                </p>
                                <p className="text-xs text-gray-500 text-center mt-1">
                                    The investigation deepens...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Personalized Message Display (for levels > 21) */}
            {!showNameReveal &&
                isNameRevealLevel &&
                personalizedMessage && (
                    <div className="personalized-message-bar">
                        <p className="text-xs text-yellow-600 italic">
                            {personalizedMessage}
                        </p>
                    </div>
                )}
        </div>
    );
};

export default CharacterNaming;
