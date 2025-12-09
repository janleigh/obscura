import { useEffect, useState } from "react";
import { useSound } from "../../../hooks/useSound";
import MiniGameIntro from "./MiniGameIntro";
import MiniGameWrapper from "./MiniGameWrapper";

const GRID_SIZE = 6;

const INTRO_MESSAGES = [
	{
		text: "[INIT] V.A.P.E. PROTOCOL LOADING...",
		color: "text-gray-400",
		delay: 500
	},
	{
		text: "[0001] VOLATILE ADJACENCY PLACEMENT ENGINE",
		color: "text-gray-400",
		delay: 80
	},
	{
		text: "[0002] NODE CALIBRATION: 6x6 MATRIX INITIALIZED",
		color: "text-green-500",
		delay: 80
	},
	{
		text: "[0003] COLLISION DETECTION: ENABLED",
		color: "text-green-500",
		delay: 80
	},
	{
		text: "[0004] DEAD ZONES DETECTED - MARKED WITH SKULL SIGIL",
		color: "text-yellow-500",
		delay: 80
	},
	{
		text: "[READY] REARRANGE NODES - PREVENT ALL ADJACENT CONTACTS",
		color: "text-green-500",
		delay: 100
	}
];

const VAPEGame = ({ onSuccess, onCancel, onFailure }) => {
	const [showIntro, setShowIntro] = useState(true);
	const [grid, setGrid] = useState([]);
	const [nodes, setNodes] = useState([]);
	const [selectedNode, setSelectedNode] = useState(null);
	const [isComplete, setIsComplete] = useState(false);
	const [deadSlots, setDeadSlots] = useState([]);
	const { playSound } = useSound();

	// biome-ignore lint/correctness/useExhaustiveDependencies: this is intentional
	useEffect(() => {
		if (!showIntro) {
			initializeGame();
		}
	}, [showIntro]);

	const initializeGame = () => {
		const newGrid = Array(GRID_SIZE * GRID_SIZE)
			.fill(null)
			.map((_, i) => i); // init grid

		// generate dead slots
		const numDeadSlots =
			Math.floor(Math.random() * 4) +
			2 +
			parseInt(localStorage.getItem("last_level") || "0");
		const deadSlotIndices = [];
		while (deadSlotIndices.length < numDeadSlots) {
			const idx = Math.floor(
				Math.random() * (GRID_SIZE * GRID_SIZE)
			);
			if (!deadSlotIndices.includes(idx)) {
				deadSlotIndices.push(idx);
			}
		}
		setDeadSlots(deadSlotIndices);

		// place initial nodes and ensure they start in invalid positions
		const numNodes = Math.floor(Math.random() * 3) + 4; // 4-6 nodes
		const initialNodes = [];
		const usedPositions = [...deadSlotIndices];

		while (initialNodes.length < numNodes) {
			const pos = Math.floor(
				Math.random() * (GRID_SIZE * GRID_SIZE)
			);
			if (!usedPositions.includes(pos)) {
				initialNodes.push({
					id: initialNodes.length,
					position: pos
				});
				usedPositions.push(pos);
			}
		}

		setNodes(initialNodes);
		setGrid(newGrid);
	};

	const getAdjacentPositions = (pos) => {
		const row = Math.floor(pos / GRID_SIZE);
		const col = pos % GRID_SIZE;
		const adj = [];

		// tldr:
		// loop through all adjacent cells including diagonals
		// skip the center cell (dr=0, dc=0)
		// calculate new row and column
		// check if within bounds
		// convert back to index and add to adjacents
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				if (dr === 0 && dc === 0) continue;
				const newRow = row + dr;
				const newCol = col + dc;
				if (
					newRow >= 0 &&
					newRow < GRID_SIZE &&
					newCol >= 0 &&
					newCol < GRID_SIZE
				) {
					adj.push(newRow * GRID_SIZE + newCol);
				}
			}
		}
		return adj;
	};

	const checkWinCondition = (currentNodes) => {
		// check if any two nodes are adjacent
		for (let i = 0; i < currentNodes.length; i++) {
			const adjacent = getAdjacentPositions(
				currentNodes[i].position
			);
			for (let j = 0; j < currentNodes.length; j++) {
				if (
					i !== j &&
					adjacent.includes(currentNodes[j].position)
				) {
					return false;
				}
			}
		}
		return true;
	};

	const handleCellClick = (cellIndex) => {
		if (isComplete) return;
		if (deadSlots.includes(cellIndex)) return;

		if (selectedNode !== null) {
			// move the selected node
			const isOccupied = nodes.some((n) => n.position === cellIndex);
			if (!isOccupied) {
				// check if the target cell is adjacent to the selected node's current position
				const selectedNodeObj = nodes.find(
					(n) => n.id === selectedNode
				);
				const adjacentPositions = getAdjacentPositions(
					selectedNodeObj.position
				);

				if (adjacentPositions.includes(cellIndex)) {
					playSound("buttonPress");
					const newNodes = nodes.map((node) =>
						node.id === selectedNode
							? { ...node, position: cellIndex }
							: node
					);
					setNodes(newNodes);
					setSelectedNode(null);

					// check win condition
					if (checkWinCondition(newNodes)) {
						setIsComplete(true);
						playSound("ciphertoolFinish");
					}
				}
			}
		} else {
			// select a node at this position
			const nodeAtPos = nodes.find((n) => n.position === cellIndex);
			if (nodeAtPos) {
				playSound("buttonPress");
				setSelectedNode(nodeAtPos.id);
			}
		}
	};

	const getCellContent = (cellIndex) => {
		if (deadSlots.includes(cellIndex)) {
			return (
				<span className="text-2xl text-red-500 opacity-50 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
					❌
				</span>
			);
		}
		const node = nodes.find((n) => n.position === cellIndex);
		if (node) {
			const isSelected = selectedNode === node.id;
			return (
				<div className="h-full w-full p-1.5">
					<div
						className={`h-full w-full rounded-sm transition-all duration-200 ${
							isSelected
								? "animate-pulse bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
								: "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
						}`}
					></div>
				</div>
			);
		}
		return null;
	};

	if (showIntro) {
		return (
			<MiniGameWrapper
				title="V.A.P.E. :: Vector Access Performance Executer"
				description=""
				colors="cyan"
				onSuccess={onSuccess}
				onCancel={onCancel}
				isComplete={false}
				hideFooter={true}
			>
				<MiniGameIntro
					title=":: INITIALIZING V.A.P.E. PROTOCOL ::"
					messages={INTRO_MESSAGES}
					onComplete={() => setShowIntro(false)}
				/>
			</MiniGameWrapper>
		);
	}

	return (
		<MiniGameWrapper
			title="V.A.P.E. :: Vector Access Performance Executer"
			description="Rearrange all nodes so that no two are touching (including diagonally). Click a node to select it, then click an empty cell to move it."
			colors="cyan"
			onSuccess={onSuccess}
			onCancel={onCancel}
			isComplete={isComplete}
		>
			<div className="flex flex-col items-center justify-center gap-6">
				{/* Stats Bar */}
				<div className="flex w-full max-w-md justify-between font-mono text-xs">
					<div className="text-cyan-600">
						NODES:{" "}
						<span className="text-cyan-400">
							{nodes.length}
						</span>
					</div>
					<div className="text-cyan-600">
						HAZARDS:{" "}
						<span className="text-red-400">
							{deadSlots.length}
						</span>
					</div>
				</div>
				<div
					className="grid gap-2 border-2 border-cyan-900/50 bg-black/30 p-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
					style={{
						gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
					}}
				>
					{grid.map((cellIndex) => {
						const node = nodes.find(
							(n) => n.position === cellIndex
						);
						const isSelected =
							node && selectedNode === node.id;
						const isDead = deadSlots.includes(cellIndex);
						const hasNode = !!node;

						let cellClasses =
							"flex h-14 w-14 cursor-pointer items-center justify-center border-2 transition-all duration-200 ";

						if (isDead) {
							cellClasses +=
								"border-red-800 bg-red-950/30 cursor-not-allowed shadow-[inset_0_0_10px_rgba(127,29,29,0.5)]";
						} else if (isSelected) {
							cellClasses +=
								"border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105";
						} else if (hasNode) {
							cellClasses +=
								"border-cyan-600 bg-cyan-950/20 hover:border-cyan-400 hover:scale-105 shadow-[0_0_8px_rgba(6,182,212,0.2)]";
						} else {
							cellClasses +=
								"border-cyan-900 bg-black hover:border-cyan-600 hover:bg-cyan-950/10 hover:scale-105";
						}

						return (
							<div
								key={cellIndex}
								onClick={() => handleCellClick(cellIndex)}
								className={cellClasses}
							>
								{getCellContent(cellIndex)}
							</div>
						);
					})}
				</div>
				{isComplete && (
					<div className="text-center font-mono text-sm text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
						✓ VECTOR ALIGNMENT SUCCESSFUL
					</div>
				)}
			</div>
		</MiniGameWrapper>
	);
};

export default VAPEGame;
