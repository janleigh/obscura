import { Router } from "express";
import GameController from "../controllers/GameController.js";

const router = Router();

router.post("/start", GameController.startGame);
router.get("/level/:id", GameController.getCurrentLevel);
router.post("/level/:id/submit", GameController.submitLevel);
router.get("/level/:id/hint", GameController.requestHint);
router.get("/player/:id/logs", GameController.getPlayerLogs);

export default router;
