import { execSync } from "child_process";
import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import prisma from "./services/PrismaService.js";

class App {
	constructor() {
		this.app = express();
		this.db = prisma;
		this.setupMiddlewares();
		this.setupRoutes();
	}

	/**
	 * Setup application middlewares
	 */
	setupMiddlewares() {
		this.app.use(cors());
		this.app.use(express.json());
	}

	/**
	 * Setup application routes
	 */
	setupRoutes() {
		// Mount all routes under /api
		this.app.use("/api", routes);

		this.app.use("/hash", (req, res) => {
			let gitHash = "dev";

			// fallback to environment variable set by Vercel
			// long live the triangle company
			if (process.env.VERCEL_GIT_COMMIT_SHA) {
				gitHash = process.env.VERCEL_GIT_COMMIT_SHA.substring(
					0,
					7
				);
			} else {
				try {
					gitHash = execSync("git rev-parse --short HEAD")
						.toString()
						.trim();
				} catch (_err) {
					// Git command failed, keep "dev"
					console.warn(
						"Could not retrieve git hash, using 'dev'"
					);
				}
			}

			res.json({ gitHash });
		});

		// Global 404 handler for unknown routes
		this.app.use((req, res) => {
			res.status(404).json({
				error: "Not Found",
				path: req.path
			});
		});

		// Global handler for errors
		this.app.use((err, req, res, next) => {
			console.error(err.stack);
			res.status(500).json({
				error: "Something went wrong!",
				message: err.message
			});
		});
	}

	/**
	 * Get the Express app instance
	 * @returns {import('express').Express}
	 */
	getApp() {
		return this.app;
	}
}

export default new App().getApp();
