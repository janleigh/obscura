import { useEffect, useRef } from "react";

const SOUNDS = {
	buttonPress: "/sounds/button_press.oga",
	bootup: "/sounds/bootup_sound.oga",
	loginMusic: "/sounds/login_music.mp3",
	terminalMusic: "/sounds/terminal_music.mp3",
	correctAns: "/sounds/correct_ans.wav",
	wrongAns: "/sounds/wrong_ans.wav",
	switchTabs: "/sounds/switch_tabs.oga",
	selectTool: "/sounds/select_tool.wav",
	rotCrackSlider: "/sounds/rot_crack_slider.oga",
	ciphertoolFinish: "/sounds/ciphertool_finish.oga"
};

export const useSound = () => {
	const audioRefs = useRef({});
	const audioContextRef = useRef(null);
	const userInteractedRef = useRef(false);

	// Enable audio on first user interaction
	useEffect(() => {
		const enableAudio = () => {
			if (!userInteractedRef.current) {
				userInteractedRef.current = true;
				
				// Create AudioContext to unlock audio playback
				if (!audioContextRef.current) {
					audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
				}
				
				// Resume AudioContext if suspended
				if (audioContextRef.current.state === 'suspended') {
					audioContextRef.current.resume();
				}
			}
		};

		// Listen for any user interaction
		const events = ['click', 'touchstart', 'keydown'];
		events.forEach(event => {
			document.addEventListener(event, enableAudio, { once: true });
		});

		return () => {
			events.forEach(event => {
				document.removeEventListener(event, enableAudio);
			});
		};
	}, []);

	const playSound = (soundKey, options = {}) => {
		const { volume = 1, loop = false, onEnded = null } = options;

		if (!SOUNDS[soundKey]) {
			console.warn(`Sound '${soundKey}' not found`);
			return;
		}

		try {
			if (!audioRefs.current[soundKey]) {
				audioRefs.current[soundKey] = new Audio(SOUNDS[soundKey]);
			}

			const audio = audioRefs.current[soundKey];
			audio.volume = volume;
			audio.loop = loop;

			if (onEnded) {
				audio.onended = onEnded;
			}

			// Reset playback to start
			audio.currentTime = 0;
			
			// Play with proper error handling
			const playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.catch((err) => {
					// If autoplay is blocked, wait for user interaction
					if (err.name === 'NotAllowedError' || err.name === 'NotSupportedError') {
						console.warn(`Autoplay blocked for '${soundKey}'. Waiting for user interaction...`);
					} else {
						console.error(`Failed to play sound '${soundKey}':`, err);
					}
				});
			}
		} catch (err) {
			console.error(`Error playing sound '${soundKey}':`, err);
		}
	};

	const stopSound = (soundKey) => {
		if (audioRefs.current[soundKey]) {
			audioRefs.current[soundKey].pause();
			audioRefs.current[soundKey].currentTime = 0;
		}
	};

	const stopAllSounds = () => {
		Object.values(audioRefs.current).forEach((audio) => {
			audio.pause();
			audio.currentTime = 0;
		});
	};

	return { playSound, stopSound, stopAllSounds };
};

export default useSound;
