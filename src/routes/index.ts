import express from "express";
import { telegramValidate } from "../controller/telegram-validate";

const router = express.Router();

router.post("/validate-init", telegramValidate);

export default router;
