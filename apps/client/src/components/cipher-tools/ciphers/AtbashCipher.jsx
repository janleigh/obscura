const AtbashCipher = () => {
	return (
		<div className="space-y-3">
			<div className="border border-indigo-900 bg-indigo-950/20 p-3">
				<div className="mb-2 text-xs text-indigo-400">
					MIRROR-FLIP REVERSER
				</div>
				<div className="text-[10px] text-gray-500">
					Ancient Hebrew cipher. A↔Z, B↔Y, C↔X... Perfect
					symmetry.
				</div>
			</div>
			<div className="border border-gray-700 bg-[#0a0a0a] p-2 font-mono text-[10px] text-gray-400">
				<div className="mb-1 text-cyan-400">MAPPING:</div>
				<div>A B C D E F G H I J K L M</div>
				<div className="text-gray-600">
					↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕
				</div>
				<div>Z Y X W V U T S R Q P O N</div>
			</div>
		</div>
	);
};

export default AtbashCipher;
