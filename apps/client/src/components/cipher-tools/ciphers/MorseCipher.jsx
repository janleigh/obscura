const MorseCipher = () => {
	return (
		<div className="space-y-3">
			<div className="border-l-2 border-amber-500 bg-amber-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-amber-400">
						DOT-DASH MODULE
					</div>
					<div className="text-[10px] text-amber-600">v2.1.0</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					International Morse Code translator. Signal-based encoding.
				</div>
			</div>
			<div className="border border-gray-800 bg-[#0a0a0a] p-3 font-mono text-[10px]">
				<div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-1 text-amber-400">
					<span>SIGNAL REFERENCE</span>
					<span className="text-[9px] opacity-50">ITU STANDARD</span>
				</div>
				<div className="grid grid-cols-3 gap-2 text-gray-400">
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-amber-500">A</span>
						<span>.-</span>
					</div>
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-amber-500">B</span>
						<span>-...</span>
					</div>
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-amber-500">C</span>
						<span>-.-.</span>
					</div>
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-amber-500">S</span>
						<span>...</span>
					</div>
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-amber-500">O</span>
						<span>---</span>
					</div>
					<div className="flex justify-between border border-gray-800 bg-black/50 px-2 py-1">
						<span className="text-amber-500">E</span>
						<span>.</span>
					</div>
				</div>
				<div className="mt-2 text-center text-[9px] text-yellow-600/70">
					* Use spaces to separate letters, slashes / for words
				</div>
			</div>
		</div>
	);
};

export default MorseCipher;
