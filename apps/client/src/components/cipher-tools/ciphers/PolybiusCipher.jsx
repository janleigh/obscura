import { POLYBIUS_GRID } from "../../../../../../packages/shared/cipherUtils";

const PolybiusCipher = () => {
	return (
		<div className="space-y-3">
			<div className="border-l-2 border-teal-500 bg-teal-950/10 p-3">
				<div className="flex items-center justify-between">
					<div className="text-xs font-bold text-teal-400">
						GRID-CRACK MODULE
					</div>
					<div className="text-[10px] text-teal-600">v4.2.0</div>
				</div>
				<div className="mt-1 text-[10px] text-gray-500">
					Coordinate-based substitution using a 5x5 grid.
				</div>
			</div>
			<div className="border border-gray-800 bg-[#0a0a0a] p-3">
				<div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-1 text-teal-400">
					<span className="text-[10px]">COORDINATE MATRIX</span>
					<span className="text-[9px] opacity-50">
						[ROW, COL]
					</span>
				</div>
				<div className="flex justify-center">
					<div>
						<div className="mb-1 flex gap-1">
							<div className="h-7 w-7" />
							{[1, 2, 3, 4, 5].map((col) => (
								<div
									key={col}
									className="flex h-7 w-7 items-center justify-center text-[10px] font-bold text-teal-500">
									{col}
								</div>
							))}
						</div>
						{POLYBIUS_GRID.map((row, rowIndex) => (
							<div
								key={rowIndex}
								className="mb-1 flex gap-1">
								<div className="flex h-7 w-7 items-center justify-center text-[10px] font-bold text-teal-500">
									{rowIndex + 1}
								</div>
								{row.map((letter, colIndex) => (
									<div
										key={colIndex}
										className="flex h-7 w-7 items-center justify-center border border-gray-800 bg-black/40 font-mono text-[10px] text-green-400 transition-all hover:border-teal-500/50 hover:bg-teal-950/20 hover:text-teal-300">
										{letter}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PolybiusCipher;
