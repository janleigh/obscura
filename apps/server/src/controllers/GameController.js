import BaseController from "./BaseController.js";
import prisma from "../services/PrismaService.js";
import bcrypt from "bcrypt";

class GameController extends BaseController {
	constructor() {
		super();

		this.startGame = this.startGame.bind(this);
		this.submitLevel = this.submitLevel.bind(this);
		this.getPlayerLogs = this.getPlayerLogs.bind(this);
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
					currentLevelId: existingUser.currentLevelId,
					score: existingUser.score,
					phaseUnlocked: existingUser.phaseUnlocked,
					hintsRemaining: existingUser.hintCredits,
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
				currentLevelId: 0,
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
	 * TODO: Make levels
	 * @description POST /api/level/:id/submit - Validate against answer_hash and cipher chains
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

			// Get level data
			// Now come to think of it, we should just hardcode levels than querying db every time LMAO
			const level = await prisma.level.findUnique({
				where: { id: levelId }
			});

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

			// Check progress
			let progress = await prisma.playerProgress.findUnique({
				where: {
					userId_levelId: {
						userId,
						levelId
					}
				}
			});

			if (!progress) {
				progress = await prisma.playerProgress.create({
					data: {
						userId,
						levelId,
						status: "in_progress"
					}
				});
			}

			// Attempts++
			await prisma.playerProgress.update({
				where: { id: progress.id },
				data: { attempts: { increment: 1 } }
			});

			// Validate answer against hash
			const isCorrect = bcrypt.compareSync(
				answer.toLowerCase().trim(),
				level.answerHash
			);

			// Log submission
			await prisma.log.create({
				data: {
					userId,
					levelId,
					eventType: "level_submit",
					details: JSON.stringify({
						correct: isCorrect,
						attempt: progress.attempts + 1
					})
				}
			});

			if (!isCorrect) {
				return this.error(res, "Incorrect answer", 400);
			}

			// Mark as completed and update user in a transaction
			const newScore = user.score + level.pointsValue;
			await prisma.$transaction([
				prisma.playerProgress.update({
					where: { id: progress.id },
					data: {
						status: "completed",
						solvedAt: new Date(),
						solutionSubmitted: answer
					}
				}),
				prisma.user.update({
					where: { id: userId },
					data: {
						score: newScore,
						currentLevelId: level.nextLevelId || levelId
					}
				})
			]);

			// Get transmission for this level
			const transmission = await prisma.transmission.findFirst({
				where: { levelId },
				orderBy: { transmissionNumber: "asc" }
			});

			return this.success(res, {
				correct: true,
				pointsEarned: level.pointsValue,
				totalScore: newScore,
				nextLevelId: level.nextLevelId,
				transmission: transmission
					? {
							message: transmission.message,
							storyFragment: transmission.storyFragment
						}
					: null
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
				include: {
					level: {
						select: {
							title: true,
							cipherType: true
						}
					}
				},
				orderBy: { createdAt: "desc" },
				take: limit,
				skip: offset
			});

			const totalCount = await prisma.log.count({
				where: { userId }
			});

			return this.success(res, {
				logs: logs.map((log) => ({
					id: log.id,
					eventType: log.eventType,
					details: log.details ? JSON.parse(log.details) : null,
					levelTitle: log.level?.title,
					cipherType: log.level?.cipherType,
					timestamp: log.createdAt
				})),
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
}

export default new GameController();
