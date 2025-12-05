import { useSound } from "../../hooks/useSound";

const CipherToolList = ({ ciphers, selectedCipher, onSelect }) => {
	const { playSound } = useSound();

	const handleSelect = (cipherValue) => {
		playSound("selectTool");
		onSelect(cipherValue);
	};

	return (
		<div className="flex w-1/3 flex-col gap-4">
			{/* Header */}
			<div className="border border-cyan-400 bg-cyan-950/20 p-3">
				<div className="crt-glow flex items-center gap-2 text-sm font-bold text-cyan-400">
					<span>CIPHER TOOLKIT v3.3.01</span>
				</div>
				<div className="mt-1 text-xs text-gray-500">
					&copy; Copyright Cicada Foundation
				</div>
			</div>
			{/* Tool Selection */}
			<div className="scrollbar-thin flex-1 overflow-y-auto border border-gray-700 bg-black">
				<div className="border-b border-gray-800 bg-[#0a0a0a] px-3 py-2">
					<span className="text-xs font-bold text-green-400">
						SELECT TOOL
					</span>
				</div>
				<div className="space-y-1 p-2">
					{ciphers.map((cipher) => (
						<button
							key={cipher.value}
							onClick={() => handleSelect(cipher.value)}
							className={`w-full border px-3 py-2 text-left text-xs transition-colors ${
								selectedCipher === cipher.value
									? "border-cyan-400 bg-cyan-950/30 text-cyan-400"
									: "border-gray-800 bg-[#0a0a0a] text-gray-400 hover:border-gray-600 hover:text-gray-300"
							}`}>
							<div className="flex items-center gap-2">
								<div className="flex-1">
									<div className="font-bold">
										{cipher.label}
									</div>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default CipherToolList;
