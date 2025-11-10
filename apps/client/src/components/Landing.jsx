import { useState } from "react";

const Landing = ({ onComplete }) => {
	const [username, setUsername] = useState("");
	const [realName, setRealName] = useState("");
	const [currentField, setCurrentField] = useState("username");
	const [showCursor, setShowCursor] = useState(true);

	useState(() => {
		const cursorInterval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, 500);
		return () => clearInterval(cursorInterval);
	}, []);

	// Handle Enter key for both fields
	// Should I just do a button?
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			if (currentField === "username" && username.trim()) {
				setCurrentField("realName");
			} else if (currentField === "realName" && realName.trim()) {
				onComplete({
					username: username.trim(),
					realName: realName.trim()
				});
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (currentField === "username" && username.trim()) {
			setCurrentField("realName");
		} else if (currentField === "realName" && realName.trim()) {
			onComplete({
				username: username.trim(),
				realName: realName.trim()
			});
		}
	};

	return (
		<div className="font-kode-mono fixed inset-0 flex items-center justify-center bg-[#0a0a0a] text-sm">
			<div className="w-full max-w-2xl p-8">
				<div className="mb-8 border border-gray-800 bg-[#0f0f0f] p-6">
					<div className="mb-6 border-b border-gray-800 pb-4">
						<span className="text-cyan-400">OBSCURA</span>
						<span className="text-gray-600"> / </span>
						<span className="text-white">
							LINGUISTIC CALIBRATION INTERFACE
						</span>
					</div>
					<div className="space-y-4 text-gray-400">
						<p>
							<span className="text-white">
								SYSTEM STATUS:
							</span>{" "}
							RECRUITMENT PROTOCOL ACTIVE
						</p>
						<p className="text-xs leading-relaxed">
							This interface requires candidate
							identification for calibration purposes.
							<br />
							Your credentials will be used for
							authentication and linguistic pattern tracking.
						</p>
					</div>
					<form
						onSubmit={handleSubmit}
						className="mt-8 space-y-6">
						{/* Username field */}
						<div>
							<label className="mb-2 block text-gray-500">
								USERNAME{" "}
								<span className="text-xs text-gray-600">
									(system identifier)
								</span>
							</label>
							<div className="flex items-center border-b border-gray-700 bg-transparent pb-1">
								<span className="mr-2 text-cyan-400">
									→
								</span>
								<input
									type="text"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									onKeyDown={handleKeyDown}
									disabled={currentField !== "username"}
									className="flex-1 border-none bg-transparent text-white outline-none disabled:text-gray-600"
									autoFocus={currentField === "username"}
									maxLength={32}
									placeholder="enter_username"
								/>
								{currentField === "username" &&
									showCursor && (
										<span className="ml-1 text-cyan-400">
											█
										</span>
									)}
							</div>
						</div>
						{/* Real name field - only show after username is entered */}
						{currentField === "realName" && (
							<div className="animate-fade-in">
								<label className="mb-2 block text-gray-500">
									FULL NAME{" "}
									<span className="text-xs text-gray-600">
										(candidate designation)
									</span>
								</label>
								<div className="flex items-center border-b border-gray-700 bg-transparent pb-1">
									<span className="mr-2 text-cyan-400">
										→
									</span>
									<input
										type="text"
										value={realName}
										onChange={(e) =>
											setRealName(e.target.value)
										}
										onKeyDown={handleKeyDown}
										className="flex-1 border-none bg-transparent text-white outline-none"
										autoFocus={
											currentField === "realName"
										}
										maxLength={64}
										placeholder="John Doe"
									/>
									{showCursor && (
										<span className="ml-1 text-cyan-400">
											█
										</span>
									)}
								</div>
							</div>
						)}
						{/* Submit */}
						<div className="pt-4 text-right text-xs text-gray-600">
							<span className="text-gray-500">PRESS</span>{" "}
							<kbd className="rounded border border-gray-700 bg-[#1a1a1a] px-2 py-1 text-gray-400">
								ENTER
							</kbd>{" "}
							<span className="text-gray-500">
								TO CONTINUE
							</span>
						</div>
					</form>
				</div>
				{/* Footer info */}
				<div className="mt-4 text-center text-xs text-gray-700">
					<p>PROJECT CLARITY · LINGUISTIC CALIBRATION v2.19.5</p>
				</div>
			</div>
			{/* Scanline effect */}
			<div className="animate-scanline pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-[rgba(255,255,255,0.02)] to-transparent bg-size-[100%_4px] opacity-20"></div>
			{/* Vignette effect */}
			<div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
		</div>
	);
};

export default Landing;
