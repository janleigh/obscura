import { Router } from "express";
import HelloWorldController from "../controllers/HelloWorldController.js";
import gameRoutes from "./game.js";

const router = Router();

router.get("/", HelloWorldController.hello);
router.use("/game", gameRoutes);

export default router;
