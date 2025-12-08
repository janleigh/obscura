const LoadingScreen = () => {
	return (
		<div className="crt-glow animate-fade-in flex flex-col items-center justify-center space-y-8">
			<div className="relative h-16 w-16">
				<div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/20"></div>
				<div className="absolute inset-2 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
			</div>
			<div className="space-y-2 text-center">
				<div className="text-lg font-bold tracking-widest text-cyan-400">
					ESTABLISHING UPLINK
				</div>
				<div className="flex flex-col gap-1 text-[10px] text-gray-500">
					<span className="animate-pulse">
						VERIFYING HANDSHAKE...
					</span>
					<span className="animate-pulse delay-75">
						EXCHANGING KEYS...
					</span>
					<span className="animate-pulse delay-150">
						DECRYPTING PAYLOAD...
					</span>
				</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
