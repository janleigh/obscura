const Button = ({
	children,
	onClick,
	disabled = false,
	variant = "primary",
	className = "",
	...props
}) => {
	const variants = {
		primary:
			"border border-cyan-400 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/30",
		secondary:
			"border border-gray-700 bg-[#1a1a1a] text-gray-400 hover:border-gray-600 hover:bg-[#202020] hover:text-gray-300",
		success:
			"border border-green-700 bg-green-950/30 text-green-400 hover:bg-green-900/30",
		danger: "border border-red-700 bg-red-950/30 text-red-400 hover:bg-red-900/30",
		warning:
			"border border-yellow-700 bg-yellow-950/30 text-yellow-400 hover:bg-yellow-900/30"
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`px-4 py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
			{...props}>
			{children}
		</button>
	);
};

export default Button;
