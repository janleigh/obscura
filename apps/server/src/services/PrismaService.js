import { PrismaClient } from "@prisma/client";

class PrismaService {
	constructor() {
		this.prisma = new PrismaClient({
			log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
		});

		console.log("PrismaService initialized");
	}

	/**
	 * Returns the Prisma Client instance.
	 * @returns {PrismaClient} The Prisma Client instance.
	 */
	getClient() {
		return this.prisma;
	}

	/**
	 * Closes the Prisma Client connection.
	 */
	async close() {
		await this.prisma.$disconnect();
		console.log("PrismaService connection closed.");
	}
}

export default new PrismaService().getClient();
