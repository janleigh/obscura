const BaconianCipher = () => {
	return (
		<div className="space-y-3">
			<div className="border-l-2 border-red-500 bg-red-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-red-400">
						BACON-PARSE MODULE
					</div>
					<div className="text-[10px] text-red-600">v3.0.1</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					Binary steganography using 5-bit A/B patterns.
				</div>
			</div>
			<div className="border border-gray-800 bg-[#0a0a0a] p-3 font-mono text-[10px]">
				<div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-1 text-red-400">
					<span>5-BIT ENCODING TABLE</span>
				</div>
				<div className="grid grid-cols-3 gap-2 text-gray-500">
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-red-400">A</span>
						<span>AAAAA</span>
					</div>
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-red-400">B</span>
						<span>AAAAB</span>
					</div>
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-red-400">C</span>
						<span>AAABA</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BaconianCipher;
