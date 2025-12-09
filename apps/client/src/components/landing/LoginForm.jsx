import { useState } from "react";
import { useSound } from "../../hooks/useSound";

const LoginForm = ({
	username,
	password,
	onUsernameChange,
	onPasswordChange,
	onSubmit,
	onRegisterInstead,
	isLoading,
	error,
	tutorialText,
	showCursor,
	typingComplete
}) => {
	const { playSound } = useSound();
	const [focusedField, setFocusedField] = useState("username");

	const handleSubmit = () => {
		if (username.trim() && password.trim()) {
			playSound("buttonPress");
			onSubmit();
		}
	};

	const handleRegisterClick = () => {
		playSound("buttonPress");
		onRegisterInstead();
	};

	return (
		<div className="crt-glow animate-fade-in w-full max-w-md md:max-w-lg 2xl:max-w-xl transition-all duration-300">
			<div className="mb-8 border border-gray-800 bg-[#0a0a0a] p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
				<div className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 bg-cyan-500"></div>
						<span className="font-bold tracking-widest text-cyan-400">
							LOGIN
						</span>
					</div>
					<span className="text-[10px] text-gray-600">
						SECURE_CONNECTION
					</span>
				</div>
				<div className="mb-8 border-l-2 border-cyan-500/30 bg-cyan-950/10 p-4 text-xs text-cyan-200/70">
					{tutorialText}
					{!typingComplete && showCursor && (
						<span className="text-cyan-400">_</span>
					)}
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					{/* Username input */}
					<div className="group mb-6 space-y-2">
						<label className="flex items-center justify-between text-[10px] tracking-wider text-gray-500 group-focus-within:text-cyan-400">
							<span>SYSTEM IDENTIFIER</span>
							<span className="opacity-0 transition-opacity group-focus-within:opacity-100">
								REQUIRED
							</span>
						</label>
						<div className="flex items-center border border-gray-800 bg-black/50 px-3 py-2 transition-colors group-focus-within:border-cyan-500/50 group-focus-within:bg-cyan-950/10">
							<span className="mr-3 text-cyan-600">❯</span>
							<input
								type="text"
								value={username}
								onChange={(e) =>
									onUsernameChange(e.target.value)
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !isLoading) {
										document
											.getElementById(
												"login-password-input"
											)
											?.focus();
									}
								}}
								onFocus={() => setFocusedField("username")}
								disabled={isLoading}
								className="flex-1 border-none bg-transparent font-mono text-sm text-white placeholder-gray-800 outline-none disabled:text-gray-600"
								placeholder="ENTER_USERNAME"
								autoFocus
								maxLength={32}
							/>
							{!isLoading &&
								showCursor &&
								focusedField === "username" && (
									<span className="ml-1 text-cyan-400">
										█
									</span>
								)}
						</div>
					</div>
					{/* Password input */}
					<div className="group mb-8 space-y-2">
						<label className="flex items-center justify-between text-[10px] tracking-wider text-gray-500 group-focus-within:text-cyan-400">
							<span>ACCESS KEY</span>
							<span className="opacity-0 transition-opacity group-focus-within:opacity-100">
								ENCRYPTED
							</span>
						</label>
						<div className="flex items-center border border-gray-800 bg-black/50 px-3 py-2 transition-colors group-focus-within:border-cyan-500/50 group-focus-within:bg-cyan-950/10">
							<span className="mr-3 text-cyan-600">❯</span>
							<input
								id="login-password-input"
								type="password"
								value={password}
								onChange={(e) =>
									onPasswordChange(e.target.value)
								}
								onKeyDown={(e) => {
									if (
										e.key === "Enter" &&
										username.trim() &&
										password.trim() &&
										!isLoading
									) {
										handleSubmit();
									}
								}}
								onFocus={() => setFocusedField("password")}
								disabled={isLoading}
								className="flex-1 border-none bg-transparent font-mono text-sm text-white placeholder-gray-800 outline-none disabled:text-gray-600"
								placeholder="ENTER_PASSWORD"
								maxLength={64}
							/>
							{!isLoading &&
								showCursor &&
								focusedField === "password" && (
									<span className="ml-1 text-cyan-400">
										█
									</span>
								)}
						</div>
					</div>
					{/* Error message */}
					{error && (
						<div className="mb-6 border border-red-900/50 bg-red-950/20 p-3 text-xs text-red-400">
							<span className="mr-2 font-bold">ERROR:</span>
							{error}
						</div>
					)}
				</form>
				{/* Actions */}
				<div className="flex items-center justify-between pt-4">
					<button
						onClick={handleRegisterClick}
						disabled={isLoading}
						className="group text-xs text-gray-500 transition-colors hover:text-gray-300 disabled:opacity-50"
					>
						<span className="mr-2 inline-block transition-transform group-hover:translate-x-1">
							→
						</span>
						NEW_CANDIDATE
					</button>
					<button
						onClick={handleSubmit}
						disabled={
							isLoading ||
							!username.trim() ||
							!password.trim()
						}
						className="group relative border border-cyan-700 bg-cyan-950/30 px-6 py-2 text-xs font-bold text-cyan-400 transition-all hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:cursor-not-allowed disabled:border-gray-800 disabled:bg-transparent disabled:text-gray-600 disabled:shadow-none"
					>
						<span className="relative z-10">
							{isLoading
								? "AUTHENTICATING..."
								: "INITIATE_LINK"}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
