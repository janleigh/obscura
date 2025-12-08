import { useEffect, useState } from "react";
import { generatePipeLevel } from "./pipeGameUtils";

const PipeGame = ({ onComplete, onClose }) => {
	const [grid, setGrid] = useState([]);
	const [isWon, setIsWon] = useState(false);
	const [moves, setMoves] = useState(0);

	// Initialize level on mount
	useEffect(() => {
		const newLevel = generatePipeLevel(5, 5);
		setGrid(newLevel);
		setIsWon(false);
	}, []);

	// Check win condition
	useEffect(() => {
		if (grid.length === 0) return;
		if (checkWinCondition(grid)) {
			setIsWon(true);
		}
	}, [grid]);

	const rotatePipe = (row, col) => {
		if (grid[row]?.[col]?.isFixed) return; // Can't rotate fixed pipes

		const newGrid = grid.map((r) => [...r]);
		const currentRotation = newGrid[row][col].rotation;
		const nextRotation = (currentRotation + 90) % 360;
		newGrid[row][col].rotation = nextRotation;
		setGrid(newGrid);
	};

	const getPipeConnections = (pipeType, rotation) => {
		// Define which directions each pipe type connects to
		// 0=up, 1=right, 2=down, 3=left
		const connections = {
			straight: [
				// Horizontal
				() => [1, 3], // rotation 0
				() => [0, 2], // rotation 90
				() => [1, 3], // rotation 180
				() => [0, 2]  // rotation 270
			],
			corner: [
				() => [0, 1], // rotation 0
				() => [1, 2], // rotation 90
				() => [2, 3], // rotation 180
				() => [3, 0]  // rotation 270
			],
			tJunction: [
				() => [0, 1, 3], // rotation 0
				() => [0, 1, 2], // rotation 90
				() => [1, 2, 3], // rotation 180
				() => [0, 2, 3]  // rotation 270
			],
			cross: () => [0, 1, 2, 3],
			source: () => [1], // Only exits right
			destination: () => [3] // Only enters from left
		};

		if (pipeType === "cross") return connections.cross();
		if (pipeType === "source") return connections.source();
		if (pipeType === "destination") return connections.destination();

		const rotationIndex = (rotation / 90) % 4;
		if (pipeType === "straight") return connections.straight[rotationIndex]();
		if (pipeType === "corner") return connections.corner[rotationIndex]();
		if (pipeType === "tJunction") return connections.tJunction[rotationIndex]();

		return [];
	};

	const checkWinCondition = (currentGrid) => {
		// Find source and destination
		let sourcePos = null;
		let destPos = null;

		for (let r = 0; r < currentGrid.length; r++) {
			for (let c = 0; c < currentGrid[r].length; c++) {
				if (currentGrid[r][c].type === "source") sourcePos = { r, c };
				if (currentGrid[r][c].type === "destination") destPos = { r, c };
			}
		}

		if (!sourcePos || !destPos) {
			console.error("Source or destination not found");
			return false;
		}

		// Log the solution path for debugging
		const sourceConnections = getPipeConnections(currentGrid[sourcePos.r][sourcePos.c].type, 0);
		console.log(`Source at ${sourcePos.r},${sourcePos.c} connects: ${sourceConnections}`);
		console.log(`Destination at ${destPos.r},${destPos.c}`);

		// BFS to check if there's a valid path
		const visited = new Set();
		const queue = [[sourcePos.r, sourcePos.c, null]]; // row, col, previous direction (null for start)
		visited.add(`${sourcePos.r},${sourcePos.c}`);

		const directions = [
			[-1, 0], // up (0)
			[0, 1],  // right (1)
			[1, 0],  // down (2)
			[0, -1]  // left (3)
		];

		let steps = 0;
		while (queue.length > 0) {
			const [r, c, prevDir] = queue.shift();
			steps++;
			const pipe = currentGrid[r][c];
			const connections = getPipeConnections(pipe.type, pipe.rotation);

			// Try all outgoing directions from this pipe
			for (let dir = 0; dir < 4; dir++) {
				// Skip if this direction isn't a connection
				if (!connections.includes(dir)) continue;

				// Skip going backwards (don't reverse)
				if (prevDir !== null && dir === (prevDir + 2) % 4) continue;

				const [nr, nc] = [r + directions[dir][0], c + directions[dir][1]];

				// Check bounds
				if (nr < 0 || nr >= currentGrid.length || nc < 0 || nc >= currentGrid[0].length) continue;

				const nextPipe = currentGrid[nr][nc];
				const incomingDir = (dir + 2) % 4; // Direction we're coming from
				const nextConnections = getPipeConnections(nextPipe.type, nextPipe.rotation);

				// Check if next pipe accepts connection from our direction
				if (!nextConnections.includes(incomingDir)) continue;

				// Check if we reached destination
				if (nextPipe.type === "destination") {
					console.log(`Path found in ${steps} steps!`);
					return true;
				}

				// Continue BFS
				const key = `${nr},${nc}`;
				if (!visited.has(key)) {
					visited.add(key);
					queue.push([nr, nc, dir]);
				}
			}
		}

		console.log(`No path found after ${steps} steps`);
		return false;
	};

	const renderPipe = (pipe, row, col) => {
		const size = 60;
		const centerX = size / 2;
		const centerY = size / 2;
		const pipeWidth = 12;
		const rotationIndex = (pipe.rotation / 90) % 4;

		const getPath = () => {
			switch (pipe.type) {
				case "straight":
					// Rotates between horizontal and vertical
					return rotationIndex === 0 || rotationIndex === 2
						? `M ${centerX - 20} ${centerY} L ${centerX + 20} ${centerY}`
						: `M ${centerX} ${centerY - 20} L ${centerX} ${centerY + 20}`;
				case "corner":
					// Connections: 0=up, 1=right, 2=down, 3=left
					// Visual corners - each L shape connects two adjacent directions
					const corners = [
						// rot 0: connections [0,1] = up+right
						`M ${centerX + 20} ${centerY} L ${centerX} ${centerY} L ${centerX} ${centerY - 20}`,
						// rot 90: connections [1,2] = right+down
						`M ${centerX + 20} ${centerY} L ${centerX} ${centerY} L ${centerX} ${centerY + 20}`,
						// rot 180: connections [2,3] = down+left
						`M ${centerX} ${centerY + 20} L ${centerX} ${centerY} L ${centerX - 20} ${centerY}`,
						// rot 270: connections [3,0] = left+up
						`M ${centerX - 20} ${centerY} L ${centerX} ${centerY} L ${centerX} ${centerY - 20}`
					];
					return corners[rotationIndex];
				case "tJunction":
					// Connections: 0=up, 1=right, 2=down, 3=left
					// rot 0: [0,1,3] = up+right+left, rot 90: [0,1,2] = up+right+down, rot 180: [1,2,3] = right+down+left, rot 270: [0,2,3] = up+down+left
					const tPaths = [
						`M ${centerX - 20} ${centerY} L ${centerX} ${centerY} L ${centerX} ${centerY - 20} M ${centerX} ${centerY} L ${centerX + 20} ${centerY}`, // left-up-right
						`M ${centerX} ${centerY - 20} L ${centerX} ${centerY} L ${centerX + 20} ${centerY} M ${centerX} ${centerY} L ${centerX} ${centerY + 20}`, // up-right-down
						`M ${centerX + 20} ${centerY} L ${centerX} ${centerY} L ${centerX} ${centerY + 20} M ${centerX} ${centerY} L ${centerX - 20} ${centerY}`, // right-down-left
						`M ${centerX} ${centerY - 20} L ${centerX} ${centerY} L ${centerX - 20} ${centerY} M ${centerX} ${centerY} L ${centerX} ${centerY + 20}`  // up-left-down
					];
					return tPaths[rotationIndex];
				case "cross":
					return `M ${centerX - 20} ${centerY} L ${centerX + 20} ${centerY} M ${centerX} ${centerY - 20} L ${centerX} ${centerY + 20}`;
				case "source":
					return `M ${centerX - 15} ${centerY} L ${centerX + 15} ${centerY}`;
				case "destination":
					return `M ${centerX - 15} ${centerY} L ${centerX + 15} ${centerY}`;
				default:
					return "";
			}
		};

		const isClickable = !pipe.isFixed && !isWon;

		return (
			<div
				key={`${row}-${col}`}
				onClick={() => isClickable && rotatePipe(row, col)}
				className={`relative flex items-center justify-center ${
					isClickable ? "cursor-pointer" : ""
				} transition-all`}
				style={{
					width: size,
					height: size,
					border: "1px solid #1f2937",
					backgroundColor: pipe.isFixed ? "#1f2937" : "#0f1419"
				}}>
				<svg width={size} height={size} style={{ position: "absolute" }}>
					<path
						d={getPath()}
						stroke={
							pipe.type === "source"
								? "#22d3ee"
								: pipe.type === "destination"
									? "#10b981"
									: "#60a5fa"
						}
						strokeWidth={pipeWidth}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{
							filter:
								pipe.type === "source"
									? "drop-shadow(0 0 4px rgba(34, 211, 238, 0.8))"
									: pipe.type === "destination"
										? "drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))"
										: "drop-shadow(0 0 2px rgba(96, 165, 250, 0.5))"
						}}
					/>
				</svg>
				{pipe.isFixed && (
					<div className="absolute text-xs text-gray-600 font-bold pointer-events-none">
						{pipe.type === "source" ? "IN" : "OUT"}
					</div>
				)}
			</div>
		);
	};

	if (isWon) {
		return (
			<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
				<div className="bg-[#0f0f0f] border border-cyan-400 p-8 rounded text-center">
					<div className="text-cyan-400 text-2xl mb-4 glow">PUZZLE SOLVED!</div>
					<button
						onClick={() => onComplete()}
						className="px-6 py-2 border border-cyan-400 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/30 transition-colors">
						CONTINUE
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
			<div className="bg-[#0f0f0f] border-2 border-cyan-400 p-6 rounded-lg shadow-lg shadow-cyan-400/20 select-none">
				<div className="mb-4 flex items-center justify-end">
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-red-400 text-xl">
						✕
					</button>
				</div>

				<div className="mb-4 text-gray-400 text-sm">
					Connect the wires from START to END
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(5, 1fr)",
						gap: "2px",
						backgroundColor: "#1a1a1a",
						padding: "4px",
						userSelect: "none"
					}}>
					{grid.map((row, r) =>
						row.map((pipe, c) => renderPipe(pipe, r, c))
					)}
				</div>

				<div className="mt-6 text-center text-gray-500 text-xs">
					Click pipes to rotate • Green = Destination • Cyan = Source
				</div>
			</div>
		</div>
	);
};

export default PipeGame;
