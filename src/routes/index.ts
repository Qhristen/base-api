import express from "express";
import {
    addUserPoint,
  getCurrentUser,
  registerUserHandler,
} from "../controller/user.controller";
import {
  createTask,
  getAllTaskByType,
  getSingletask,
  submitTask,
} from "../controller/task.controller";
import {
  createBoost,
  getAllBoostByType,
  getSingleBoost,
  submitBoost,
} from "../controller/boost.controller";

const router = express.Router();

router.post("/user/reg", registerUserHandler);
router.get("/user/:userId", getCurrentUser);
router.post("/user/:userId/add-point", addUserPoint);

router.post("/task/create", createTask);
router.get("/task/:taskId", getSingletask);
router.get("/task/:type/all", getAllTaskByType);
router.post("/task/submit", submitTask);

router.post("/boost/create", createBoost);
router.get("/boost/:boostId", getSingleBoost);
router.get("/boost/:type/all", getAllBoostByType);
router.post("/boost/submit", submitBoost);

export default router;
