const MorseCipher = () => {
	return (
		<div className="space-y-3">
			<div className="border border-amber-900 bg-amber-950/20 p-3">
				<div className="mb-2 text-xs text-amber-400">
					DOT-DASH DECODER
				</div>
				<div className="text-[10px] text-gray-500">
					International Morse Code translator. Dots, dashes, and
					spaces.
				</div>
			</div>
			<div className="space-y-1 border border-gray-700 bg-[#0a0a0a] p-2 font-mono text-[10px] text-gray-400">
				<div>
					<span className="text-cyan-400">A:</span> .-{" "}
					<span className="text-cyan-400">B:</span> -...{" "}
					<span className="text-cyan-400">C:</span> -.-.
				</div>
				<div>
					<span className="text-cyan-400">S:</span> ...{" "}
					<span className="text-cyan-400">O:</span> ---{" "}
					<span className="text-cyan-400">S:</span> ...
				</div>
				<div className="mt-1 text-yellow-400">
					Spaces separate letters
				</div>
			</div>
		</div>
	);
};

export default MorseCipher;
