const CipherInputForm = ({
	value,
	onChange,
	placeholder = "Paste encrypted text here..."
}) => {
	return (
		<div className="space-y-2">
			<label className="flex items-center gap-2 text-xs text-gray-500">
				INPUT CIPHERTEXT
			</label>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="scrollbar-thin h-32 w-full resize-none border border-gray-700 bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-green-400 outline-none focus:border-green-400"
			/>
		</div>
	);
};

export default CipherInputForm;
