const AtbashCipher = () => {
	return (
		<div className="space-y-3">
			<div className="border-l-2 border-indigo-500 bg-indigo-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-indigo-400">
						MIRROR-FLIP MODULE
					</div>
					<div className="text-[10px] text-indigo-600">
						v1.1.0
					</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					Ancient Hebrew substitution cipher. Perfect symmetry
					A↔Z.
				</div>
			</div>
			<div className="border border-gray-800 bg-[#0a0a0a] p-3 font-mono text-[10px]">
				<div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-1 text-indigo-400">
					<span>MAPPING MATRIX</span>
					<span className="text-[9px] opacity-50">
						SYMMETRIC
					</span>
				</div>
				<div className="grid gap-2">
					<div className="flex justify-between text-gray-400">
						<span>A B C D E F G H I J K L M</span>
					</div>
					<div className="flex justify-between text-indigo-500/50">
						<span>↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕ ↕</span>
					</div>
					<div className="flex justify-between text-indigo-300">
						<span>Z Y X W V U T S R Q P O N</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AtbashCipher;
