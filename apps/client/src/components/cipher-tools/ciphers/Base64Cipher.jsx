const Base64Cipher = () => {
	return (
		<div className="space-y-3">
			<div className="border-l-2 border-orange-500 bg-orange-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-orange-400">
						B64-DECODE MODULE
					</div>
					<div className="text-[10px] text-orange-600">v1.5.2</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					Standard encoding for binary-to-text transmission.
				</div>
			</div>
			<div className="border border-gray-800 bg-[#0a0a0a] p-3 font-mono text-[10px]">
				<div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-1 text-orange-400">
					<span>FORMAT SPECIFICATION</span>
					<span className="text-[9px] opacity-50">RFC 4648</span>
				</div>
				<div className="space-y-1 text-gray-400">
					<div className="flex items-center gap-2">
						<span className="text-orange-500">►</span>
						<span>Converts binary data to ASCII text</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-orange-500">►</span>
						<span>
							Padding character: <span className="text-white">=</span>
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-orange-500">►</span>
						<span>Alphabet: A-Z, a-z, 0-9, +, /</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Base64Cipher;
