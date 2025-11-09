import { Router } from "express";
import GameController from "../controllers/GameController.js";

const router = Router();

router.post("/start", GameController.startGame);
router.post("/level/:id/submit", GameController.submitLevel);
router.get("/player/:id/logs", GameController.getPlayerLogs);

export default router;
