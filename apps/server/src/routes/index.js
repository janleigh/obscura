import { Router } from "express";
import cipherRoutes from "./cipher.js";
import gameRoutes from "./game.js";

const router = Router();

router.use("/game", gameRoutes);
router.use("/cipher", cipherRoutes);

export default router;
