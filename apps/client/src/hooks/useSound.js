import { useRef } from "react";

const SOUNDS = {
	buttonPress: "/src/components/sound/button_press.oga",
	bootup: "/src/components/sound/bootup_sound.oga",
	loginMusic: "/src/components/sound/login_music.mp3",
	terminalMusic: "/src/components/sound/terminal_music.mp3",
	correctAns: "/src/components/sound/correct_ans.wav",
	wrongAns: "/src/components/sound/wrong_ans.wav",
	switchTabs: "/src/components/sound/switch_tabs.oga",
	selectTool: "/src/components/sound/select_tool.wav",
	rotCrackSlider: "/src/components/sound/rot_crack_slider.oga",
	ciphertoolFinish: "/src/components/sound/ciphertool_finish.oga"
};

export const useSound = () => {
	const audioRefs = useRef({});

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
			audio.play().catch((err) => {
				console.error(`Failed to play sound '${soundKey}':`, err);
			});
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
