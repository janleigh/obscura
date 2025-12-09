import { useState } from "react";
import { useSound } from "../../hooks/useSound";

const RegistrationForm = ({
	username,
	realName,
	password,
	onUsernameChange,
	onRealNameChange,
	onPasswordChange,
	onSubmit,
	onBack,
	isLoading,
	error,
	tutorialText,
	showCursor,
	typingComplete
}) => {
	const { playSound } = useSound();
	const [focusedField, setFocusedField] = useState("username");

	const handleSubmit = () => {
		if (username.trim() && realName.trim() && password) {
			playSound("buttonPress");
			onSubmit();
		}
	};

	const handleBack = () => {
		playSound("buttonPress");
		onBack();
	};

	return (
		<div className="crt-glow animate-fade-in w-full max-w-md md:max-w-lg 2xl:max-w-xl transition-all duration-300">
			<div className="mb-8 border border-gray-800 bg-[#0a0a0a] p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
				<div className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 bg-yellow-500"></div>
						<span className="font-bold tracking-widest text-yellow-400">
							REGISTRATION
						</span>
					</div>
					<span className="text-[10px] text-gray-600">
						NEW_CANDIDATE
					</span>
				</div>
				<div className="mb-8 border-l-2 border-yellow-500/30 bg-yellow-950/10 p-4 text-xs text-yellow-200/70">
					{tutorialText}
					{!typingComplete && showCursor && (
						<span className="text-yellow-400">_</span>
					)}
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					{/* Username input */}
					<div className="group mb-4 space-y-2">
						<label className="flex items-center justify-between text-[10px] tracking-wider text-gray-500 group-focus-within:text-yellow-400">
							<span>SYSTEM IDENTIFIER</span>
						</label>
						<div className="flex items-center border border-gray-800 bg-black/50 px-3 py-2 transition-colors group-focus-within:border-yellow-500/50 group-focus-within:bg-yellow-950/10">
							<span className="mr-3 text-yellow-600">❯</span>
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
												"reg-realname-input"
											)
											?.focus();
									} else if (e.key === "Escape") {
										handleBack();
									}
								}}
								onFocus={() => setFocusedField("username")}
								disabled={isLoading}
								className="flex-1 border-none bg-transparent font-mono text-sm text-white placeholder-gray-800 outline-none disabled:text-gray-600"
								placeholder="CREATE USERNAME"
								autoFocus
								maxLength={32}
							/>
							{!isLoading &&
								showCursor &&
								focusedField === "username" && (
									<span className="ml-1 text-yellow-400">
										█
									</span>
								)}
						</div>
					</div>
					{/* Real name input */}
					<div className="group mb-4 space-y-2">
						<label className="flex items-center justify-between text-[10px] tracking-wider text-gray-500 group-focus-within:text-yellow-400">
							<span>CANDIDATE DESIGNATION</span>
						</label>
						<div className="flex items-center border border-gray-800 bg-black/50 px-3 py-2 transition-colors group-focus-within:border-yellow-500/50 group-focus-within:bg-yellow-950/10">
							<span className="mr-3 text-yellow-600">❯</span>
							<input
								id="reg-realname-input"
								type="text"
								value={realName}
								onChange={(e) =>
									onRealNameChange(e.target.value)
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !isLoading) {
										document
											.getElementById(
												"reg-password-input"
											)
											?.focus();
									} else if (e.key === "Escape") {
										handleBack();
									}
								}}
								onFocus={() => setFocusedField("realName")}
								disabled={isLoading}
								className="flex-1 border-none bg-transparent font-mono text-sm text-white placeholder-gray-800 outline-none disabled:text-gray-600"
								placeholder="ENTER DISPLAY NAME"
								maxLength={64}
							/>
							{!isLoading &&
								showCursor &&
								focusedField === "realName" && (
									<span className="ml-1 text-yellow-400">
										█
									</span>
								)}
						</div>
					</div>
					{/* Password input */}
					<div className="group mb-8 space-y-2">
						<label className="flex items-center justify-between text-[10px] tracking-wider text-gray-500 group-focus-within:text-yellow-400">
							<span>ACCESS KEY</span>
						</label>
						<div className="flex items-center border border-gray-800 bg-black/50 px-3 py-2 transition-colors group-focus-within:border-yellow-500/50 group-focus-within:bg-yellow-950/10">
							<span className="mr-3 text-yellow-600">❯</span>
							<input
								id="reg-password-input"
								type="password"
								value={password}
								onChange={(e) =>
									onPasswordChange(e.target.value)
								}
								onKeyDown={(e) => {
									if (
										e.key === "Enter" &&
										username.trim() &&
										realName.trim() &&
										password.trim() &&
										!isLoading
									) {
										handleSubmit();
									} else if (e.key === "Escape") {
										handleBack();
									}
								}}
								onFocus={() => setFocusedField("password")}
								disabled={isLoading}
								className="flex-1 border-none bg-transparent font-mono text-sm text-white placeholder-gray-800 outline-none disabled:text-gray-600"
								placeholder="CREATE PASSWORD"
								maxLength={64}
							/>
							{!isLoading &&
								showCursor &&
								focusedField === "password" && (
									<span className="ml-1 text-yellow-400">
										█
									</span>
								)}
						</div>
						{/* Password Requirements Checklist */}
						{focusedField === "password" && (
							<div className="mt-2 space-y-1 pl-1 animate-fade-in">
								<div className="text-[10px] text-gray-500 mb-1">
									PASSWORD CHECKLIST:
								</div>
								{[
									{
										label: "8-30 CHARACTERS [MANDATORY]",
										valid:
											password.length >= 8 &&
											password.length <= 30
									},
									{
										label: "UPPER & LOWERCASE LETTERS",
										valid:
											/[a-z]/.test(password) &&
											/[A-Z]/.test(password)
									},
									{
										label: "ONE NUMBER",
										valid: /[0-9]/.test(password)
									},
									{
										label: "ONE SPECIAL CHARACTER",
										valid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
											password
										)
									}
								].map((req, i) => (
									<div
										key={i}
										className="flex items-center gap-2 text-[10px]"
									>
										<span
											className={
												req.valid
													? "text-green-500"
													: "text-gray-600"
											}
										>
											{req.valid ? "✓" : "○"}
										</span>
										<span
											className={
												req.valid
													? "text-green-400/80"
													: "text-gray-600"
											}
										>
											{req.label}
										</span>
									</div>
								))}
							</div>
						)}
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
						onClick={handleBack}
						disabled={isLoading}
						className="group text-xs text-gray-500 transition-colors hover:text-gray-300 disabled:opacity-50"
					>
						<span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">
							←
						</span>
						ABORT_REGISTRATION
					</button>
					<button
						onClick={handleSubmit}
						disabled={
							isLoading ||
							!username.trim() ||
							!realName.trim() ||
							!password.trim()
						}
						className="group relative border border-yellow-700 bg-yellow-950/30 px-6 py-2 text-xs font-bold text-yellow-400 transition-all hover:bg-yellow-900/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] disabled:cursor-not-allowed disabled:border-gray-800 disabled:bg-transparent disabled:text-gray-600 disabled:shadow-none"
					>
						<span className="relative z-10">
							{isLoading
								? "PROCESSING..."
								: "SUBMIT APPLICATION"}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default RegistrationForm;
