import {
	getHint,
	getLevelById,
	validateAnswer
} from "../../../../packages/shared/levels.js";
import prisma from "../services/PrismaService.js";
import BaseController from "./BaseController.js";

class GameController extends BaseController {
	constructor() {
		super();

		this.startGame = this.startGame.bind(this);
		this.submitLevel = this.submitLevel.bind(this);
		this.getPlayerLogs = this.getPlayerLogs.bind(this);
		this.requestHint = this.requestHint.bind(this);
		this.getCurrentLevel = this.getCurrentLevel.bind(this);
	}

	/**
	 * @description POST /api/game/start - Initialize player session
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async startGame(req, res) {
		try {
			const { username } = req.body;

			if (!username) {
				return this.error(res, "Username is required", 400);
			}

			// Check if user exists duh
			const existingUser = await prisma.user.findUnique({
				where: { username }
			});

			if (existingUser) {
				// Update last active and log game start event
				await prisma.$transaction([
					prisma.log.create({
						data: {
							userId: existingUser.id,
							eventType: "game_start",
							details: JSON.stringify({
								session_resumed: true
							})
						}
					}),
					prisma.user.update({
						where: { id: existingUser.id },
						data: { lastActive: new Date() }
					})
				]);

				return this.success(res, {
					userId: existingUser.id,
					username: existingUser.username,
					currentLevel: existingUser.currentLevel,
					score: existingUser.score,
					phaseUnlocked: existingUser.phaseUnlocked,
					hintsRemaining: existingUser.hintCredits,
					completedLevels: JSON.parse(
						existingUser.completedLevels
					),
					message: "Session resumed"
				});
			}

			// If not, we create new user
			const newUser = await prisma.user.create({
				data: {
					username,
					currentLevelId: 0
				}
			});

			// Then log it. CAUSE TELEMETRY BABY
			await prisma.log.create({
				data: {
					userId: newUser.id,
					eventType: "game_start",
					details: JSON.stringify({ new_player: true })
				}
			});

			return this.created(res, {
				userId: newUser.id,
				username: newUser.username,
				currentLevel: 1,
				score: 0,
				phaseUnlocked: 1,
				hintsRemaining: 3,
				message: "New game session created"
			});
		} catch (error) {
			console.error("Error starting game:", error);
			return this.serverError(res, "Failed to start game session");
		}
	}

	/**
	 * @description POST /api/level/:id/submit - Validate answer against hardcoded levels
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async submitLevel(req, res) {
		try {
			const levelId = parseInt(req.params.id);
			const { userId, answer } = req.body;

			if (!userId || !answer) {
				return this.error(
					res,
					"User ID and answer are required",
					400
				);
			}

			// Get level from hardcoded data
			const level = getLevelById(levelId);
			if (!level) {
				return this.notFound(res, "Level not found");
			}

			// Get user data
			const user = await prisma.user.findUnique({
				where: { id: userId }
			});

			if (!user) {
				return this.notFound(res, "User not found");
			}

			// Parse attempt history
			const attemptHistory = JSON.parse(user.attemptHistory);
			const levelAttempts = attemptHistory[levelId] || 0;

			// Validate answer using hardcoded validation
			const isCorrect = validateAnswer(levelId, answer);

			// Update attempt count
			attemptHistory[levelId] = levelAttempts + 1;

			// Log submission
			await prisma.log.create({
				data: {
					userId,
					levelId,
					eventType: "level_submit",
					details: JSON.stringify({
						correct: isCorrect,
						attempt: attemptHistory[levelId],
						answer: answer.substring(0, 50) // Log partial answer for debugging
					})
				}
			});

			if (!isCorrect) {
				// Update attempt history even on failure
				await prisma.user.update({
					where: { id: userId },
					data: {
						attemptHistory: JSON.stringify(attemptHistory)
					}
				});

				return this.error(res, "Incorrect answer", 400);
			}

			// Mark as completed and update user
			const completedLevels = JSON.parse(user.completedLevels);
			if (!completedLevels.includes(levelId)) {
				completedLevels.push(levelId);
			}

			const newScore = user.score + level.pointsValue;
			const nextLevelId = levelId + 1;

			await prisma.user.update({
				where: { id: userId },
				data: {
					score: newScore,
					currentLevel: nextLevelId,
					completedLevels: JSON.stringify(completedLevels),
					attemptHistory: JSON.stringify(attemptHistory),
					lastActive: new Date()
				}
			});

			return this.success(res, {
				correct: true,
				pointsEarned: level.pointsValue,
				totalScore: newScore,
				nextLevelId,
				storyFragment: level.storyFragment,
				transmission: level.transmission
			});
		} catch (error) {
			console.error("Error submitting level:", error);
			return this.serverError(res, "Failed to submit answer");
		}
	}

	/**
	 * @description GET /api/player/:id/logs - Return player event history
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getPlayerLogs(req, res) {
		try {
			const userId = parseInt(req.params.id);
			const limit = parseInt(req.query.limit) || 50;
			const offset = parseInt(req.query.offset) || 0;

			const logs = await prisma.log.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
				take: limit,
				skip: offset
			});

			const totalCount = await prisma.log.count({
				where: { userId }
			});

			return this.success(res, {
				logs: logs.map((log) => {
					const level = log.levelId
						? getLevelById(log.levelId)
						: null;
					return {
						id: log.id,
						eventType: log.eventType,
						details: log.details
							? JSON.parse(log.details)
							: null,
						levelTitle: level?.title,
						cipherType: level?.cipherType,
						timestamp: log.createdAt
					};
				}),
				pagination: {
					total: totalCount,
					limit,
					offset,
					hasMore: offset + limit < totalCount
				}
			});
		} catch (error) {
			console.error("Error fetching player logs:", error);
			return this.serverError(res, "Failed to retrieve player logs");
		}
	}

	/**
	 * @description GET /api/level/:id/hint - Request a hint for a level
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async requestHint(req, res) {
		try {
			const levelId = parseInt(req.params.id);
			const { userId } = req.query;

			if (!userId) {
				return this.error(res, "User ID is required", 400);
			}

			const user = await prisma.user.findUnique({
				where: { id: parseInt(userId) }
			});

			if (!user) {
				return this.notFound(res, "User not found");
			}

			if (user.hintCredits <= 0) {
				return this.error(res, "No hint credits remaining", 400);
			}

			// Get next hint line
			const hintIndex = user.hintsUsed;
			const hintLine = getHint(levelId, hintIndex);

			if (!hintLine) {
				return this.error(
					res,
					"No more hints available for this level",
					400
				);
			}

			// Deduct hint credit
			await prisma.user.update({
				where: { id: parseInt(userId) },
				data: {
					hintCredits: { decrement: 1 },
					hintsUsed: { increment: 1 }
				}
			});

			// Log hint request
			await prisma.log.create({
				data: {
					userId: parseInt(userId),
					levelId,
					eventType: "hint_request",
					details: JSON.stringify({ hintIndex })
				}
			});

			return this.success(res, {
				hint: hintLine,
				hintsRemaining: user.hintCredits - 1
			});
		} catch (error) {
			console.error("Error requesting hint:", error);
			return this.serverError(res, "Failed to retrieve hint");
		}
	}

	/**
	 * @description GET /api/level/:id - Get current level data (without answer)
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getCurrentLevel(req, res) {
		try {
			const levelId = parseInt(req.params.id);

			const level = getLevelById(levelId);
			if (!level) {
				return this.notFound(res, "Level not found");
			}

			// Return level data without the answer
			const {
				answer,
				...levelDataWithoutAnswer
			} = level;

			return this.success(res, levelDataWithoutAnswer);
		} catch (error) {
			console.error("Error fetching level:", error);
			return this.serverError(res, "Failed to retrieve level");
		}
	}
}

export default new GameController();
