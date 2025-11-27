import { POLYBIUS_GRID } from "../../../../../../packages/shared/cipherUtils";

const PolybiusCipher = () => {
	return (
		<div className="space-y-3">
			<div className="border border-teal-900 bg-teal-950/20 p-3">
				<div className="mb-2 text-xs text-teal-400">
					GRID-CRACK DECODER
				</div>
				<div className="text-[10px] text-gray-500">
					Each letter is encoded as [row][column] coordinates.
				</div>
			</div>
			<div className="border border-gray-700 bg-[#0a0a0a] p-3">
				<div className="mb-2 flex gap-1">
					<div className="h-7 w-7" />
					{[1, 2, 3, 4, 5].map((col) => (
						<div
							key={col}
							className="flex h-7 w-7 items-center justify-center text-[10px] font-bold text-cyan-400">
							{col}
						</div>
					))}
				</div>
				{POLYBIUS_GRID.map((row, rowIndex) => (
					<div key={rowIndex} className="mb-1 flex gap-1">
						<div className="flex h-7 w-7 items-center justify-center text-[10px] font-bold text-cyan-400">
							{rowIndex + 1}
						</div>
						{row.map((letter, colIndex) => (
							<div
								key={colIndex}
								className="flex h-7 w-7 items-center justify-center border border-gray-700 font-mono text-[10px] text-green-400 transition-colors hover:bg-gray-800">
								{letter}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default PolybiusCipher;
