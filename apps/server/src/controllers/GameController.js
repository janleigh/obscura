import bcrypt from "bcrypt";
import {
	getLevelById,
	PHASE_KEYS,
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
		this.submitPhaseKey = this.submitPhaseKey.bind(this);
	}

	/**
	 * @description POST /api/game/start - Initialize player session
	 * @param {import('express').Request} [req]
	 * @param {import('express').Response} [res]
	 */
	async startGame(req, res) {
		try {
			const { username, realName, password } = req.body;

			if (!username) {
				return this.error(res, "Username is required", 400);
			}

			// Check if user exists
			const existingUser = await prisma.user.findUnique({
				where: { username }
			});

			if (existingUser) {
				// Existing user - validate password
				if (!password) {
					return this.error(res, "Password is required", 400);
				}

				const isPasswordValid = await bcrypt.compare(
					password,
					existingUser.password
				);

				if (!isPasswordValid) {
					return this.error(res, "Invalid password", 401);
				}

				// Update last active and realName if provided
				const updateData = { lastActive: new Date() };
				if (realName && !existingUser.realName) {
					updateData.realName = realName;
				}

				const [, updatedUser] = await prisma.$transaction([
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
						data: updateData
					})
				]);

				return this.success(res, {
					userId: updatedUser.id,
					username: updatedUser.username,
					realName: updatedUser.realName,
					currentLevel: updatedUser.currentLevel,
					phaseUnlocked: updatedUser.phaseUnlocked,
					completedLevels: JSON.parse(
						updatedUser.completedLevels
					),
					message: "Session resumed"
				});
			}

			// New user - require password
			if (!password) {
				return this.error(
					res,
					"Password is required for registration",
					400
				);
			}

			if (password.length < 8) {
				return this.error(
					res,
					"Password must be at least 8 characters",
					400
				);
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create new user
			const newUser = await prisma.user.create({
				data: {
					username,
					password: hashedPassword,
					realName: realName || null,
					currentLevel: 0
				}
			});

			// Log it
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
				realName: newUser.realName,
				currentLevel: 0,
				phaseUnlocked: 1,
				completedLevels: [],
				message: "New game session created"
			});
		} catch (error) {
			console.error("Error starting game:", error);
			return this.serverError(res, "Failed to start game session");
		}
	}

	/**
	 * @description POST /api/game/level/:id/submit - Validate answer against hardcoded levels
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async submitLevel(req, res) {
		try {
			const levelId = parseInt(req.params.id);
			const { userId, answer } = req.body;

			console.log(
				`[SUBMIT] Level ${levelId} by user ${userId}: "${answer}"`
			);

			if (!userId || !answer) {
				return this.error(
					res,
					"User ID and answer are required",
					400
				);
			}

			// Get user data
			const user = await prisma.user.findUnique({
				where: { id: userId }
			});

			if (!user) {
				return this.notFound(res, "User not found");
			}

			// Get level from hardcoded data
			const level = getLevelById(levelId);
			if (!level) {
				return this.notFound(res, "Level not found");
			}

			// Validate answer using hardcoded validation
			const isCorrect = validateAnswer(levelId, answer);
			console.log(`[SUBMIT] Answer correct: ${isCorrect}`);

			// Log submission
			await prisma.log.create({
				data: {
					userId,
					levelId,
					eventType: "level_submit",
					details: JSON.stringify({
						correct: isCorrect,
						answer: answer.substring(0, 50)
					})
				}
			});

			if (!isCorrect) {
				return this.error(res, "Incorrect answer", 400);
			}

			// Mark as completed and update user
			const completedLevels = JSON.parse(user.completedLevels);
			if (!completedLevels.includes(levelId)) {
				completedLevels.push(levelId);
			}

			const nextLevelId = levelId + 1;

			console.log(`[SUBMIT] Advancing user to level ${nextLevelId}`);

			await prisma.user.update({
				where: { id: userId },
				data: {
					currentLevel: nextLevelId,
					completedLevels: JSON.stringify(completedLevels),
					lastActive: new Date()
				}
			});

			return this.success(res, {
				correct: true,
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
	 * @description GET /api/game/level/:id/hint - Request a hint for a level
	 * Returns the first hintLine from the level. Hints are always available.
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

			const level = getLevelById(levelId);
			if (!level) {
				return this.notFound(res, "Level not found");
			}

			// Get first hint line from hintLines array
			const hint =
				level.hintLines && level.hintLines.length > 0
					? level.hintLines[0]
					: null;

			if (!hint) {
				return this.error(
					res,
					"No hints available for this level",
					400
				);
			}

			// Log hint request
			await prisma.log.create({
				data: {
					userId: parseInt(userId),
					levelId,
					eventType: "hint_view",
					details: JSON.stringify({ hint })
				}
			});

			return this.success(res, { hint });
		} catch (error) {
			console.error("Error requesting hint:", error);
			return this.serverError(res, "Failed to retrieve hint");
		}
	}

	/**
	 * @description POST /api/game/phasekey - Submit a phase key to unlock deep archives
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async submitPhaseKey(req, res) {
		try {
			const { userId, phaseKey } = req.body;

			if (!userId || !phaseKey) {
				return this.error(
					res,
					"User ID and phase key are required",
					400
				);
			}

			// Get user data
			const user = await prisma.user.findUnique({
				where: { id: userId }
			});

			if (!user) {
				return this.notFound(res, "User not found");
			}

			// Validate phase key
			const normalizedKey = phaseKey.trim().toUpperCase();
			const validKey = PHASE_KEYS.find(
				(key) => key.keyName === normalizedKey
			);

			if (!validKey) {
				await prisma.log.create({
					data: {
						userId,
						eventType: "phase_key_invalid",
						details: JSON.stringify({
							attempted_key: normalizedKey.substring(0, 20)
						})
					}
				});

				return this.error(res, "Invalid phase key", 400);
			}

			// Check if phase is already unlocked
			if (user.phaseUnlocked >= validKey.phase) {
				return this.success(res, {
					success: true,
					message: `Phase ${validKey.phase} was already unlocked`,
					unlockedPhase: user.phaseUnlocked
				});
			}

			// Unlock phase
			const newPhase = Math.max(user.phaseUnlocked, validKey.phase);
			await prisma.user.update({
				where: { id: userId },
				data: {
					phaseUnlocked: newPhase,
					lastActive: new Date()
				}
			});

			// Log phase unlock
			await prisma.log.create({
				data: {
					userId,
					eventType: "phase_unlock",
					details: JSON.stringify({
						phase: validKey.phase,
						keyName: validKey.keyName
					})
				}
			});

			return this.success(res, {
				success: true,
				message: `Phase ${validKey.phase} unlocked! Deep archives accessible.`,
				unlockedPhase: newPhase
			});
		} catch (error) {
			console.error("Error submitting phase key:", error);
			return this.serverError(res, "Failed to submit phase key");
		}
	}
}

export default new GameController();
