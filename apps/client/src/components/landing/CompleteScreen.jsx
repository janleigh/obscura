const CompleteScreen = () => {
	return (
		<div className="crt-glow animate-fade-in flex flex-col items-center justify-center space-y-8">
			<div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-500/50 bg-green-950/20">
				<div className="text-4xl text-green-400">✓</div>
				<div className="absolute inset-0 animate-ping rounded-full border border-green-500/30 opacity-50"></div>
			</div>
			<div className="space-y-2 text-center">
				<div className="text-lg font-bold tracking-widest text-green-400">
					ACCESS GRANTED
				</div>
				<div className="text-xs text-gray-500">
					WELCOME TO OBSCURA
				</div>
			</div>
			{/* <div className="w-64 overflow-hidden rounded-full bg-gray-900">
				<div className="h-1 animate-[width_1s_ease-in-out_forwards] bg-green-500" style={{ width: '100%' }}></div>
			</div> */}
		</div>
	);
};

export default CompleteScreen;
