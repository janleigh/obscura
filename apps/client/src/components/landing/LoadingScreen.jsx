const LoadingScreen = () => {
	return (
		<div className="crt-glow animate-fade-in text-center">
			<div className="space-y-4">
				<div className="text-yellow-300">
					[ CONNECTING TO OBSCURA NETWORK... ]
				</div>
				<div className="text-xs text-gray-600">
					<span className="animate-pulse">
						Verifying credentials
					</span>
				</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
