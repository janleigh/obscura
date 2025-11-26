const Base64Cipher = () => {
	return (
		<div className="space-y-3">
			<div className="border border-orange-900 bg-orange-950/20 p-3">
				<div className="mb-2 text-xs text-orange-400">
					B64-DECODE UTILITY
				</div>
				<div className="text-[10px] text-gray-500">
					Standard Base64 decoder for data transmission encoding.
				</div>
			</div>
			<div className="space-y-1 text-[10px] text-gray-600">
				<div>• Converts binary data to ASCII text</div>
				<div>• Look for '=' padding at the end</div>
				<div>• Uses A-Z, a-z, 0-9, +, / alphabet</div>
			</div>
		</div>
	);
};

export default Base64Cipher;
