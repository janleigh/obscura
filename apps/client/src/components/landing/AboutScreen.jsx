import { useSound } from "../../hooks/useSound";
import Button from "../shared/Button";

const AboutScreen = ({ onBack }) => {
	const { playSound } = useSound();

	const handleBack = () => {
		playSound("buttonPress");
		onBack();
	};

	const developers = [
		{ name: "Jan Leigh", username: "janleigh", role: "Lead Developer/UI Designer" },
		{ name: "Afel", username: "neverGiveup222", role: "Developer/Story Writer" },
		{ name: "Victor Alexander", username: "Victor-Alexander-O", role: "Developer/Sound Designer" },
	];

	return (
		<div className="crt-glow animate-fade-in w-full max-w-2xl space-y-8 text-center">
			<div className="relative space-y-4">
				<div className="text-4xl font-bold tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
					SYSTEM ARCHITECTS
				</div>
				<div className="h-px w-full bg-linear-to-r from-transparent via-cyan-900 to-transparent"></div>
			</div>
			<div className="grid gap-6 md:grid-cols-2">
				{developers.map((dev, index) => (
					<div
						key={index}
						className="group relative flex flex-col items-center border border-cyan-900/30 bg-black/40 p-6 transition-all hover:border-cyan-500/50 hover:bg-cyan-950/20"
					>
						<div className="absolute -inset-px -z-10 bg-cyan-500/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100"></div>
						<img
							src={`https://github.com/${dev.username}.png`}
							alt={dev.name}
							className="mb-4 h-24 w-24 rounded-full border-2 border-cyan-900/50 object-cover shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
						/>
						<div className="mb-2 text-xl font-bold text-cyan-300">
							{dev.name}
						</div>
						<div className="text-xs tracking-widest text-gray-500 uppercase">
							{dev.role}
						</div>
					</div>
				))}
			</div>
			<div className="pt-8">
				<Button onClick={handleBack} variant="secondary">
					RETURN TO ROOT
				</Button>
			</div>
		</div>
	);
};

export default AboutScreen;
