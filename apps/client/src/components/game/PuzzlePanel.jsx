import { useEffect, useRef, useState } from "react";
import { useTypingEffect } from "../../hooks/useTypingEffect";

// track visited levels globally
// used to skip typing effect on revisits
const visitedLevels = new Set();

const PuzzlePanel = ({
	level,
	showingStoryFragment,
	storyFragmentText
}) => {
	const scrollRef = useRef(null);
	const isVisited = visitedLevels.has(level.id);

	const [commandTyped, setCommandTyped] = useState(isVisited);
	const [showFetchingDots, setShowFetchingDots] = useState(false);
	const [fetchComplete, setFetchComplete] = useState(isVisited);
	const [dots, setDots] = useState("");

	// build the level description markdown
	const buildLevelMarkdown = () => {
		let markdown = `# ${level.title}\n\n`;

		if (level.transmission?.message) {
			markdown += `${level.transmission.message}\n\n`;
		}

		if (
			level.transmission?.type === "image" &&
			level.transmission?.imageUrl
		) {
			markdown += `![Encrypted Image](${level.transmission.imageUrl})\n\n`;
			markdown += `*Right-click → Save image to analyze offline*\n\n`;
		}

		if (level.cipherText) {
			markdown += `## Cipher Text\n\n\`\`\`\n${level.cipherText}\n\`\`\`\n\n`;
		} else {
			markdown += `## Cipher Text\n\n*[ NO CIPHER TEXT RECEIVED ]*\n\n`;
		}

		if (level.hintPoem) {
			const hintText = Array.isArray(level.hintPoem)
				? level.hintPoem.join(" ")
				: level.hintPoem;
			markdown += `## Hint\n\n> "${hintText}"\n\n`;
		}

		return markdown;
	};

	// i hope yall are not dyslexic bc this is a mess just for UI
	const command = `# ftchlvl --lvl-server="projectclarity@lvlserver.org" --format=markdown`;
	const { displayedText: typedCommand, isComplete: commandComplete } =
		useTypingEffect(
			command,
			30,
			!showingStoryFragment && !fetchComplete && !isVisited
		);

	const levelMarkdown = buildLevelMarkdown();
	const { displayedText: typedContent, isComplete: contentComplete } =
		useTypingEffect(levelMarkdown, 15, fetchComplete && !isVisited);

	const storyCommand = `# sysctl -dmsg --priority=high`;
	const {
		displayedText: typedStoryCommand,
		isComplete: storyCommandComplete
	} = useTypingEffect(storyCommand, 30, showingStoryFragment);
	const {
		displayedText: typedStoryFragment,
		isComplete: storyComplete
	} = useTypingEffect(
		storyFragmentText || "",
		20,
		showingStoryFragment && storyCommandComplete
	);

	useEffect(() => {
		if (contentComplete && !visitedLevels.has(level.id)) {
			visitedLevels.add(level.id);
		}
	}, [contentComplete, level.id]);

	// track previous story fragment state
	const prevShowingStoryRef = useRef(showingStoryFragment);

	// reset states when story ends
	useEffect(() => {
		if (prevShowingStoryRef.current && !showingStoryFragment) {
			visitedLevels.delete(level.id);
			setCommandTyped(false);
			setShowFetchingDots(false);
			setFetchComplete(false);
			setDots("");
		}

		prevShowingStoryRef.current = showingStoryFragment;
	}, [showingStoryFragment, level.id]);

	// xommand typing sequence
	useEffect(() => {
		if (commandComplete && !showingStoryFragment && !isVisited) {
			setCommandTyped(true);
			setTimeout(() => setShowFetchingDots(true), 300);
		}
	}, [commandComplete, showingStoryFragment, isVisited]);

	// fetching dots animation
	useEffect(() => {
		if (showFetchingDots && !fetchComplete) {
			const interval = setInterval(() => {
				setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
			}, 300);

			// complete fetch after 1.5 seconds
			const timer = setTimeout(() => {
				setShowFetchingDots(false);
				setFetchComplete(true);
			}, 1500);

			return () => {
				clearInterval(interval);
				clearTimeout(timer);
			};
		}
	}, [showFetchingDots, fetchComplete]);

	// reset states when level changes
	useEffect(() => {
		if (!showingStoryFragment) {
			const visited = visitedLevels.has(level.id);
			setCommandTyped(visited);
			setShowFetchingDots(false);
			setFetchComplete(visited);
			setDots("");
		}
	}, [level.id, showingStoryFragment]);

	// auto-scroll as text appears
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, []);

	// md renderer
	const renderMarkdown = (text) => {
		const lines = text.split("\n");
		const elements = [];
		let inCodeBlock = false;
		let codeBlockContent = [];
		let codeBlockStart = -1;

		lines.forEach((line, idx) => {
			if (line.startsWith("```")) {
				if (!inCodeBlock) {
					inCodeBlock = true;
					codeBlockStart = idx;
					codeBlockContent = [];
				} else {
					elements.push(
						<div
							key={`codeblock-${codeBlockStart}`}
							className="group animate-fadeIn relative my-4 border border-gray-700 bg-[#0a0a0a] transition-all duration-300 hover:border-green-500/30"
						>
							<div className="flex items-center justify-between border-b border-gray-800 bg-black/50 px-3 py-1">
								<span className="text-[10px] text-gray-500">
									ENCRYPTED DATA BLOCK
								</span>
								<button
									onClick={(e) => {
										e.preventDefault();
										navigator.clipboard.writeText(
											codeBlockContent.join("\n")
										);
									}}
									className="text-[10px] text-green-500 opacity-70 hover:opacity-100 hover:text-green-300 transition-opacity"
								>
									[COPY]
								</button>
							</div>
							<div className="p-3 font-mono text-sm break-all text-green-400">
								{codeBlockContent.join("\n")}
							</div>
						</div>
					);
					inCodeBlock = false;
					codeBlockContent = [];
				}
				return;
			}

			// collect content if inside codeblock
			if (inCodeBlock) {
				codeBlockContent.push(line);
				return;
			}

			// regular markdown parsing
			if (line.startsWith("# ")) {
				elements.push(
					<div
						key={idx}
						className="mb-4 border-b border-cyan-900/30 pb-2"
					>
						<div className="text-lg font-bold text-cyan-400">
							{line.substring(2)}
						</div>
					</div>
				);
			} else if (line.startsWith("## ")) {
				elements.push(
					<div
						key={idx}
						className="mt-6 mb-2 flex items-center gap-2"
					>
						<span className="h-1 w-1 rounded-full bg-green-500"></span>
						<div className="text-sm font-bold text-green-400">
							{line.substring(3)}
						</div>
					</div>
				);
			} else if (line.startsWith("> ")) {
				// hint as quoteblock
				const hintText = line
					.substring(2)
					.replace(/^"/, "")
					.replace(/"$/, "");
				elements.push(
					<div
						key={idx}
						className="animate-fadeIn relative my-4 border-l-2 border-yellow-600/50 bg-yellow-950/10 p-4 transition-all duration-300"
					>
						<div className="absolute top-2 left-2 text-2xl text-yellow-700/30">
							"
						</div>
						<div className="px-4 text-center text-sm text-yellow-200/70 italic">
							{hintText}
						</div>
						<div className="absolute right-2 bottom-2 text-2xl text-yellow-700/30">
							"
						</div>
					</div>
				);
			} else if (line.startsWith("![")) {
				// image parser
				const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
				if (match) {
					elements.push(
						<div
							key={idx}
							className="my-4 border border-gray-800 bg-black p-1"
						>
							<img
								src={match[2]}
								alt={match[1]}
								className="crt-glow animate-fadeIn h-auto max-w-full transition-all duration-500"
								style={{
									maxHeight: "300px",
									imageRendering: "pixelated"
								}}
							/>
							<div className="mt-1 text-center text-[9px] text-gray-600">
								{match[1]}
							</div>
						</div>
					);
				}
			} else if (line.startsWith("*") && line.endsWith("*")) {
				elements.push(
					<div
						key={idx}
						className="my-2 text-center text-xs text-yellow-600/80 italic"
					>
						{line.slice(1, -1)}
					</div>
				);
			} else if (line.trim() === "") {
				elements.push(<div key={idx} className="h-2"></div>);
			} else {
				elements.push(
					<div
						key={idx}
						className="text-xs leading-relaxed text-gray-300"
					>
						{line}
					</div>
				);
			}
		});

		return elements;
	};

	// story fragment
	if (showingStoryFragment) {
		return (
			<div className="puzzle-panel flex h-full flex-col border border-gray-800 bg-black font-mono">
				<div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-3 py-2">
					<div className="flex items-center gap-2">
						<span className="text-xs font-bold tracking-wider text-cyan-400">
							INCOMING TRANSMISSION
						</span>
						<span className="animate-pulse rounded bg-cyan-900/30 px-1 py-0.5 text-[9px] text-cyan-400">
							LIVE
						</span>
					</div>
					<div className="text-[9px] text-gray-600">
						SECURE CHANNEL
					</div>
				</div>
				<div
					ref={scrollRef}
					className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4"
				>
					<div className="space-y-2">
						{/* Command line */}
						<div className="text-xs">
							<span className="text-green-400">
								{typedStoryCommand}
							</span>
							{!storyCommandComplete && (
								<span className="animate-pulse">▊</span>
							)}
						</div>
						{/* Story content */}
						{storyCommandComplete && (
							<div className="mt-4 border border-cyan-900/50 bg-cyan-950/10 p-4 shadow-[0_0_20px_rgba(8,145,178,0.1)]">
								<div className="mb-3 flex items-center gap-2 border-b border-cyan-900/30 pb-2">
									<span className="text-lg text-cyan-500">
										⚠
									</span>
									<div className="text-xs font-bold tracking-wider text-cyan-500">
										PRIORITY MESSAGE RECEIVED
									</div>
								</div>
								<p className="font-mono text-sm leading-relaxed text-cyan-300">
									{typedStoryFragment}
									{!storyComplete && (
										<span className="animate-pulse">
											▊
										</span>
									)}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="puzzle-panel flex h-full flex-col border border-gray-800 bg-black font-mono">
			<div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-3 py-2">
				<div className="flex items-center gap-2">
					<span className="text-xs font-bold tracking-wider text-green-400">
						TRANSMISSION LOG MODULE
					</span>
					<span className="rounded bg-green-900/30 px-1 py-0.5 text-[9px] text-green-600">
						v4.0
					</span>
				</div>
				<div className="text-[9px] text-gray-600">ENCRYPTED</div>
			</div>
			<div
				ref={scrollRef}
				className="scrollbar-thin min-h-0 flex-1 overflow-y-auto bg-black p-4"
			>
				<div className="space-y-2">
					{/* Command line */}
					<div className="text-xs">
						<span className="text-green-400">
							{typedCommand}
						</span>
						{!commandComplete && (
							<span className="animate-pulse">▊</span>
						)}
					</div>
					{/* Fetching status */}
					{commandTyped && showFetchingDots && (
						<div className="text-xs text-gray-500">
							Fetching transmission data{dots}
						</div>
					)}
					{/* Success message */}
					{fetchComplete && !contentComplete && (
						<div className="text-xs text-green-400">
							✓ Transmission acquired. Parsing markdown...
						</div>
					)}
					{/* Markdown content */}
					{fetchComplete && (
						<div className="mt-3 border-t border-gray-800/50 pt-3">
							{renderMarkdown(typedContent)}
							{!contentComplete && (
								<span className="animate-pulse text-green-400">
									▊
								</span>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PuzzlePanel;
