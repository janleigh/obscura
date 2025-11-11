import { Router } from "express";
import CipherController from "../controllers/CipherController.js";

const router = Router();

// basic operations
router.post("/encrypt", CipherController.encrypt);
router.post("/decrypt", CipherController.decrypt);

// cipher chain operations
router.post("/chain/encrypt", CipherController.encryptChain);
router.post("/chain/decrypt", CipherController.decryptChain);
router.post("/chain/validate", CipherController.validateChain);

// uitility endpoints
router.get("/types", CipherController.getCipherTypes);
router.get("/presets", CipherController.getPresets);
router.post("/analyze", CipherController.analyzeCipher);

export default router;
