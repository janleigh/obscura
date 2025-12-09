import { useEffect, useState } from "react";

const SignalNoise = ({ level = 1, phase = 1 }) => {
	const [glitchIntensity, setGlitchIntensity] = useState("none");
	const [showFlicker, setShowFlicker] = useState(false);

	useEffect(() => {
		// TODO! you can test this by changing the conditions below
		// calculate glitch intensity based on level
		if (level <= 2) {
			setGlitchIntensity("none");
		} else if (level <= 6) {
			setGlitchIntensity("subtle");
		} else if (level <= 15) {
			setGlitchIntensity("moderate");
		} else if (level <= 27) {
			setGlitchIntensity("aggressive");
		} else {
			setGlitchIntensity("extreme");
		}

		// Level 28+ gets background flicker
		if (level >= 28) {
			const flickerInterval = setInterval(
				() => {
					setShowFlicker((prev) => !prev);
				},
				Math.random() * 500 + 200
			); // random flicker between 200-700ms

			return () => clearInterval(flickerInterval);
		}
	}, [level]);

	// don't render anything for early levels
	// or does it?
	if (glitchIntensity === "none") {
		return null;
	}

	return (
		<>
			{/* Static noise overlay */}
			<div
				className={`signal-noise signal-noise--${glitchIntensity}`}
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					pointerEvents: "none",
					zIndex: 9998,
					opacity:
						glitchIntensity === "subtle"
							? 0.02
							: glitchIntensity === "moderate"
								? 0.05
								: glitchIntensity === "aggressive"
									? 0.1
									: 0.15
				}}
			>
				<div className="noise-pattern"></div>
			</div>
			{/* Scanline effect */}
			<div
				className={`scanlines scanlines--${glitchIntensity}`}
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					pointerEvents: "none",
					zIndex: 9999,
					opacity:
						glitchIntensity === "subtle"
							? 0.03
							: glitchIntensity === "moderate"
								? 0.06
								: 0.1
				}}
			/>
			{/* Level 28+ background flicker */}
			{level >= 28 && (
				<div
					className="background-flicker"
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						pointerEvents: "none",
						zIndex: 9997,
						backgroundColor: showFlicker
							? "#ffffff"
							: "#000000",
						opacity: showFlicker ? 0.05 : 0,
						transition: "opacity 0.05s"
					}}
				/>
			)}
		</>
	);
};

export default SignalNoise;
