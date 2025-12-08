// Pipe puzzle level generator
// Generates solvable, randomized 5x5 pipe puzzles

export const PIPE_TYPES = {
	STRAIGHT: "straight",
	CORNER: "corner",
	T_JUNCTION: "tJunction",
	CROSS: "cross",
	SOURCE: "source",
	DESTINATION: "destination"
};

// Generate a valid path through the grid
const generatePath = (rows, cols) => {
	// Start from a random edge and create a path to another random edge
	const startRow = Math.floor(Math.random() * rows);
	const startCol = 0; // Always start from left

	const endRow = Math.floor(Math.random() * rows);
	const endCol = cols - 1; // Always end at right

	const path = [[startRow, startCol]];
	let [currentRow, currentCol] = [startRow, startCol];

	// Generate a winding path using random walk
	while (currentRow !== endRow || currentCol !== endCol) {
		const moves = [];

		// Try to move towards destination
		if (currentRow < endRow) moves.push([1, 0]);
		if (currentRow > endRow) moves.push([-1, 0]);
		if (currentCol < endCol) moves.push([0, 1]);
		if (currentCol > endCol) moves.push([0, -1]);

		// Add a random direction for variety
		if (Math.random() > 0.3) {
			const randomMoves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
			moves.push(randomMoves[Math.floor(Math.random() * randomMoves.length)]);
		}

		// Pick a move
		const [dr, dc] = moves[Math.floor(Math.random() * moves.length)];
		const newRow = Math.max(0, Math.min(rows - 1, currentRow + dr));
		const newCol = Math.max(0, Math.min(cols - 1, currentCol + dc));

		if (newRow !== currentRow || newCol !== currentCol) {
			currentRow = newRow;
			currentCol = newCol;
			path.push([currentRow, currentCol]);
		}
	}

	return { startPos: [startRow, startCol], endPos: [endRow, endCol], path };
};

// Determine pipe type based on connections
const getPipeTypeFromConnections = (connections) => {
	if (connections.length === 4) return PIPE_TYPES.CROSS;
	if (connections.length === 3) return PIPE_TYPES.T_JUNCTION;
	if (connections.length === 2) {
		// Check if it's straight or corner
		const [a, b] = connections.sort();
		if ((a === 0 && b === 2) || (a === 1 && b === 3)) {
			return PIPE_TYPES.STRAIGHT;
		}
		return PIPE_TYPES.CORNER;
	}
	return PIPE_TYPES.CORNER;
};

// Get rotation angle for pipe connections
const getRotationForConnections = (pipeType, connections) => {
	const sortedConnections = connections.sort((a, b) => a - b);
	const connectionKey = sortedConnections.join(",");

	const rotationMap = {
		straight: {
			"0,2": 90, // vertical
			"1,3": 0   // horizontal
		},
		corner: {
			"0,1": 0,
			"1,2": 90,
			"2,3": 180,
			"0,3": 270
		},
		tJunction: {
			"0,1,3": 0,
			"0,1,2": 90,
			"1,2,3": 180,
			"0,2,3": 270
		}
	};

	return rotationMap[pipeType]?.[connectionKey] || 0;
};

export const generatePipeLevel = (rows, cols) => {
	const { startPos, endPos, path } = generatePath(rows, cols);

	// Initialize grid with all corners (these will be randomized later)
	const grid = Array(rows)
		.fill(null)
		.map(() =>
			Array(cols)
				.fill(null)
				.map(() => ({
					type: PIPE_TYPES.CORNER,
					rotation: 0,
					isFixed: false
				}))
		);

	// Mark solution path cells
	const solutionCells = new Set();
	path.forEach(([r, c]) => solutionCells.add(`${r},${c}`));

	// Place source and destination (these are FIXED)
	grid[startPos[0]][startPos[1]] = {
		type: PIPE_TYPES.SOURCE,
		rotation: 0,
		isFixed: true
	};

	grid[endPos[0]][endPos[1]] = {
		type: PIPE_TYPES.DESTINATION,
		rotation: 0,
		isFixed: true
	};

	// Place pipes along the solution path with CORRECT types and rotations
	for (let i = 0; i < path.length; i++) {
		const [r, c] = path[i];
		if (
			grid[r][c].type !== PIPE_TYPES.SOURCE &&
			grid[r][c].type !== PIPE_TYPES.DESTINATION
		) {
			const connectionsSet = new Set();

			// Check previous cell
			if (i > 0) {
				const [pr, pc] = path[i - 1];
				if (pr === r && pc === c - 1) connectionsSet.add(3); // from left
				if (pr === r && pc === c + 1) connectionsSet.add(1); // from right
				if (pr === r - 1 && pc === c) connectionsSet.add(0); // from up
				if (pr === r + 1 && pc === c) connectionsSet.add(2); // from down
			}

			// Check next cell
			if (i < path.length - 1) {
				const [nr, nc] = path[i + 1];
				if (nr === r && nc === c - 1) connectionsSet.add(3); // to left
				if (nr === r && nc === c + 1) connectionsSet.add(1); // to right
				if (nr === r - 1 && nc === c) connectionsSet.add(0); // to up
				if (nr === r + 1 && nc === c) connectionsSet.add(2); // to down
			}

			const connections = Array.from(connectionsSet);
			const pipeType = getPipeTypeFromConnections(connections);
			const rotation = getRotationForConnections(pipeType, connections);

			grid[r][c] = {
				type: pipeType,
				rotation,
				isFixed: false
			};
		}
	}

	// Randomize rotations for ONLY non-solution, non-fixed pipes to create puzzle
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const isOnPath = solutionCells.has(`${r},${c}`);
			// Only randomize if: not fixed AND not on solution path
			if (!grid[r][c].isFixed && !isOnPath) {
				grid[r][c].rotation = (Math.floor(Math.random() * 4) * 90) % 360;
			}
		}
	}

	return grid;
};
