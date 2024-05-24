import express from "express";
import { getCurrentUser, registerUserHandler } from "../controller/user.controller";

const router = express.Router();

router.post("/user/reg", registerUserHandler);
router.post("/user/:userId", getCurrentUser);

export default router;