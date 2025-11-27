const BaconianCipher = () => {
	return (
		<div className="space-y-3">
			<div className="border border-red-900 bg-red-950/20 p-3">
				<div className="mb-2 text-xs text-red-400">
					BACON-PARSE ANALYZER
				</div>
				<div className="text-[10px] text-gray-500">
					Binary steganography using A/B patterns (Francis
					Bacon's cipher).
				</div>
			</div>
			<div className="border border-gray-700 bg-[#0a0a0a] p-2 font-mono text-[10px] text-gray-400">
				<div className="mb-1 text-cyan-400">5-BIT ENCODING:</div>
				<div>
					<span className="text-green-400">A</span> = AAAAA
				</div>
				<div>
					<span className="text-green-400">B</span> = AAAAB
				</div>
				<div>
					<span className="text-green-400">C</span> = AAABA
				</div>
				<div className="mt-1 text-yellow-400">
					Can hide in any A/B pattern!
				</div>
			</div>
		</div>
	);
};

export default BaconianCipher;
