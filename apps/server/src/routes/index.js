import { Router } from "express";
import HelloWorldController from "../controllers/HelloWorldController.js";

const router = Router();

router.get("/", HelloWorldController.hello);

export default router;
