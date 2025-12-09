import { useCallback, useEffect, useRef, useState } from "react";
import { useSound } from "../../../hooks/useSound";
import MiniGameIntro from "./MiniGameIntro";
import MiniGameWrapper from "./MiniGameWrapper";

const INTRO_MESSAGES = [
	{
		text: "[INIT] PROTOCOL REBOOT...",
		color: "text-gray-400",
		delay: 300
	},
	{
		text: "[0001] LOADING TRAVERSAL ALGORITHM...",
		color: "text-gray-400",
		delay: 80
	},
	{
		text: "[0002] OBJECTIVE: ACQUIRE DATA PACKETS (GLOWING)",
		color: "text-green-500",
		delay: 80
	},
	{
		text: "[0003] RULE: ALTERNATE NODE TYPES",
		color: "text-yellow-500",
		delay: 80
	},
	{
		text: "[0004] SEQUENCE: CIRCLE -> SQUARE -> CIRCLE...",
		color: "text-yellow-500",
		delay: 80
	},
	{
		text: "[0005] TIME EXTENSION GRANTED ON DATA ACQUISITION",
		color: "text-green-500",
		delay: 80
	},
	{
		text: "[READY] SYSTEM ARMED. GOOD LUCK.",
		color: "text-green-500",
		delay: 100
	}
];

const GRID_SIZE = Math.max(
	5,
	Math.min(4, Math.floor(window.innerWidth / 100))
);
const INITIAL_TIME = 25;
const TIME_BONUS = 5;

const NodeGame = ({ onSuccess, onCancel, onFailure }) => {
	const [showIntro, setShowIntro] = useState(true);
	const [nodes, setNodes] = useState([]);
	const [currentNodeId, setCurrentNodeId] = useState(null);
	const [targets, setTargets] = useState(new Set());
	const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
	const [gameState, setGameState] = useState("intro"); // intro, playing, won, lost
	const [pathHistory, setPathHistory] = useState([]);
	const [isComplete, setIsComplete] = useState(false);
	const [failed, setFailed] = useState(false);

	const timerRef = useRef(null);
	const { playSound } = useSound();

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	const initializeLevel = useCallback(() => {
		const newNodes = [];
		for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
			newNodes.push({
				id: i,
				row: Math.floor(i / GRID_SIZE),
				col: i % GRID_SIZE,
				type: Math.random() > 0.5 ? "CIRCLE" : "SQUARE"
			});
		}

		const startId = Math.floor(
			Math.random() * (GRID_SIZE * GRID_SIZE)
		);

		let currentWalkId = startId;
		let currentType = newNodes[startId].type;
		const walkPath = [startId];
		const potentialTargets = new Set();

		for (let step = 0; step < 12; step++) {
			const neighbors = getNeighbors(currentWalkId);
			const validNextSteps = neighbors.filter((nId) => {
				const nextType = newNodes[nId].type;
				return nextType !== currentType && !walkPath.includes(nId);
			});

			// no valid steps
			if (validNextSteps.length === 0) break;

			const nextId =
				validNextSteps[
					Math.floor(Math.random() * validNextSteps.length)
				];
			walkPath.push(nextId);
			potentialTargets.add(nextId);
			currentWalkId = nextId;
			currentType = newNodes[nextId].type;
		}

		// if path is too short, retry
		if (potentialTargets.size < 3) {
			initializeLevel();
			return;
		}

		// select 3-5 targets from the walk
		const targetArray = Array.from(potentialTargets);
		const selectedTargets = new Set();
		const numTargets = Math.min(
			5,
			Math.max(3, Math.floor(targetArray.length * 0.6))
		);

		while (selectedTargets.size < numTargets) {
			const t =
				targetArray[
					Math.floor(Math.random() * targetArray.length)
				];
			selectedTargets.add(t);
		}

		setNodes(newNodes);
		setCurrentNodeId(startId);
		setTargets(selectedTargets);
		setPathHistory([startId]);
		setTimeLeft(INITIAL_TIME);
		setGameState("playing");
		setIsComplete(false);
		setFailed(false);
	}, []);

	useEffect(() => {
		if (!showIntro) {
			initializeLevel();
		}
	}, [showIntro, initializeLevel]);

	// timer logic
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
		useEffect(() => {
		if (gameState === "playing") {
			timerRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 0) {
						handleGameOver();
						return 0;
					}
					return prev - 0.1;
				});
			}, 100);
		}
		return () => clearInterval(timerRef.current);
	}, [gameState]);

	const getNeighbors = (id) => {
		const row = Math.floor(id / GRID_SIZE);
		const col = id % GRID_SIZE;
		const neighbors = [];

		// directions: up, down, left, right
		const directions = [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1]
		];

		directions.forEach(([dr, dc]) => {
			const newRow = row + dr;
			const newCol = col + dc;
			if (
				newRow >= 0 &&
				newRow < GRID_SIZE &&
				newCol >= 0 &&
				newCol < GRID_SIZE
			) {
				neighbors.push(newRow * GRID_SIZE + newCol);
			}
		});
		return neighbors;
	};

	const handleNodeClick = (targetId) => {
		if (gameState !== "playing") return;

		const neighbors = getNeighbors(currentNodeId);
		// not a neighbor
		if (!neighbors.includes(targetId)) {
			return;
		}

		const currentNode = nodes[currentNodeId];
		const targetNode = nodes[targetId];

		if (currentNode.type === targetNode.type) {
			handleGameOver();
			return;
		}

		playSound("buttonPress");
		setCurrentNodeId(targetId);
		setPathHistory((prev) => [...prev, targetId]);

		if (targets.has(targetId)) {
			const newTargets = new Set(targets);
			newTargets.delete(targetId);
			setTargets(newTargets);

			// bonus time
			setTimeLeft((prev) => Math.min(prev + TIME_BONUS, 30)); // Cap at 30s

			// win condition
			if (newTargets.size === 0) {
				handleWin();
			}
		}
	};

	const handleGameOver = () => {
		setGameState("lost");
		setFailed(true);
		clearInterval(timerRef.current);
		if (onFailure) {
			setTimeout(() => onFailure(), 2000);
		}
	};

	const handleWin = () => {
		setGameState("won");
		setIsComplete(true);
		clearInterval(timerRef.current);
		playSound("ciphertoolFinish");
	};

	if (showIntro) {
		return (
			<MiniGameWrapper
				title="NODEH3X3R v2.0 :: Sequence Breach Protocol"
				description=""
				onSuccess={onSuccess}
				onCancel={onCancel}
				isComplete={false}
				hideFooter={true}
			>
				<MiniGameIntro
					title=":: SYSTEM BREACH PROTOCOL ::"
					messages={INTRO_MESSAGES}
					onComplete={() => setShowIntro(false)}
				/>
			</MiniGameWrapper>
		);
	}

	return (
		<MiniGameWrapper
			title="NODEH3X3R v2.0 :: Sequence Breach Protocol"
			description="Navigate the grid. Alternate CIRCLE/SQUARE. Collect highlighted nodes for time."
			onSuccess={onSuccess}
			onCancel={onCancel}
			isComplete={isComplete}
		>
			<div className="flex flex-col items-center justify-center gap-6">
				<div className="flex w-full max-w-md justify-between font-mono text-xs">
					<div className="text-green-600">
						TARGETS:{" "}
						<span className="text-green-400">
							{targets.size}
						</span>
					</div>
					<div className="text-green-600">
						TIME:{" "}
						<span
							className={`${timeLeft < 5 ? "animate-pulse text-red-500" : "text-green-400"}`}
						>
							{timeLeft.toFixed(1)}s
						</span>
					</div>
				</div>
				{/* Game Board */}
				<div className="relative p-4">
					<svg className="pointer-events-none absolute inset-0 z-0 ml-0.5 h-full w-full">
						{nodes.map((node) => {
							const neighbors = getNeighbors(node.id);
							return neighbors.map((nId) => {
								if (nId < node.id) return null; // Avoid duplicates
								const neighbor = nodes[nId];

								const cellSize = 48;
								const gap = 12;
								const padding = 12;

								const x1 =
									padding +
									node.col * (cellSize + gap) +
									cellSize / 2;
								const y1 =
									padding +
									node.row * (cellSize + gap) +
									cellSize / 2;
								const x2 =
									padding +
									neighbor.col * (cellSize + gap) +
									cellSize / 2;
								const y2 =
									padding +
									neighbor.row * (cellSize + gap) +
									cellSize / 2;

								const isPathEdge =
									pathHistory.includes(node.id) &&
									pathHistory.includes(nId) &&
									Math.abs(
										pathHistory.indexOf(node.id) -
											pathHistory.indexOf(nId)
									) === 1;

								return (
									<line
										key={`${node.id}-${nId}`}
										x1={x1}
										y1={y1}
										x2={x2}
										y2={y2}
										stroke={
											isPathEdge
												? "#22c55e"
												: "#14532d"
										}
										strokeWidth={
											isPathEdge ? "3" : "1"
										}
										className="transition-all duration-300"
										opacity={isPathEdge ? 1 : 0.3}
									/>
								);
							});
						})}
					</svg>
					{/* Nodes Grid */}
					<div
						className="relative z-10 grid gap-4"
						style={{
							gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
						}}
					>
						{nodes.map((node) => {
							const isCurrent = currentNodeId === node.id;
							const isTarget = targets.has(node.id);
							const isVisited = pathHistory.includes(
								node.id
							);
							const isNeighbor = getNeighbors(
								currentNodeId
							).includes(node.id);

							let borderColor = "border-green-900";
							let bgColor = "bg-black";
							let glow = "";

							if (isCurrent) {
								borderColor = "border-green-400";
								bgColor = "bg-green-900/30";
								glow =
									"shadow-[0_0_15px_rgba(34,197,94,0.5)]";
							} else if (isTarget) {
								borderColor = "border-green-500";
								glow =
									"animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.3)]";
							} else if (isVisited) {
								borderColor = "border-green-700";
								bgColor = "bg-green-900/10";
							}

							if (isNeighbor && gameState === "playing") {
								borderColor =
									"border-green-600 hover:border-green-400";
								bgColor = "hover:bg-green-900/20";
							}

							return (
								<button
									key={node.id}
									onClick={() =>
										handleNodeClick(node.id)
									}
									disabled={
										gameState !== "playing" ||
										(!isNeighbor && !isCurrent)
									}
									className={`flex h-11 w-11 items-center justify-center border-2 transition-all duration-200 ${borderColor} ${bgColor} ${glow} ${node.type === "CIRCLE" ? "rounded-full" : "rounded-sm"} ${isNeighbor ? "scale-100 cursor-pointer hover:scale-105" : "cursor-default"} ${isCurrent ? "z-20 scale-110" : ""} `}
								>
									{/* Inner Symbol */}
									<div
										className={` ${node.type === "CIRCLE" ? "h-4 w-4 rounded-full" : "h-4 w-4 rounded-sm"} ${isTarget ? "animate-ping bg-green-400" : isVisited ? "bg-green-700" : "bg-green-900"} `}
									/>
								</button>
							);
						})}
					</div>
				</div>
				{/* Results */}
				{isComplete && (
					<div className="text-center font-mono text-sm text-green-400">
						✓ DATA ACQUISITION COMPLETE
					</div>
				)}
				{failed && (
					<div className="text-center font-mono text-sm text-red-400">
						✗ SEQUENCE ERROR - DECRYPTION DELAYED
					</div>
				)}
			</div>
		</MiniGameWrapper>
	);
};

export default NodeGame;
