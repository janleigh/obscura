import { Router } from "express";
import gameRoutes from "./game.js";

const router = Router();

router.use("/game", gameRoutes);

export default router;
