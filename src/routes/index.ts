import express from "express";
import {
  createBoost,
  getAllBoostByType,
  getSingleBoost,
  submitBoost,
} from "../controller/boost.controller";
import {
  addLeagueTask,
  addRefTask,
  addSpecialTask,
  getAllLeagueTask,
  getAllRefTask,
  getAllSpecialTask,
  getSingleSpecialTask,
  submitLeagueTask,
  submitRefTask,
  submitSpecialTask
} from "../controller/task.controller";
import {
  addUserPoint,
  getAllUsers,
  getCurrentUser,
  getStats,
  registerUserHandler,
} from "../controller/user.controller";

const router = express.Router();

//users routes
router.post("/user/reg", registerUserHandler);
router.get("/user/:userId", getCurrentUser);
router.post("/user/:userId/add-point", addUserPoint);
router.get("/users", getAllUsers);

//task routes
router.post("/task/special/create", addSpecialTask);
router.post("/task/league/create", addLeagueTask);
router.post("/task/ref/create", addRefTask);
router.get("/task/special/:taskId", getSingleSpecialTask);
router.get("/task/special", getAllSpecialTask);
router.get("/task/league", getAllLeagueTask);
router.get("/task/ref", getAllRefTask);
router.post("/task/special/submit", submitSpecialTask);
router.post("/task/ref/submit", submitRefTask);
router.post("/task/league/submit", submitLeagueTask);

//boosts routes
router.post("/boost/create", createBoost);
router.get("/boost/:boostId", getSingleBoost);
router.get("/boost/:type/all", getAllBoostByType);
router.post("/boost/submit", submitBoost);

//stats
router.get("/stats", getStats);

export default router;
