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
  getAllUserActivity,
  getAllUserActivityById,
  getAllUserTask,
  getSingleSpecialTask,
  submitLeagueTask,
  submitRefTask,
  submitSpecialTask,
  submitUserActivity
} from "../controller/task.controller";
import {
  addUserPoint,
  getAllUsers,
  getCurrentUser,
  getStats,
  registerUserHandler,
  updateUserFullEnergyBar,
  updateUserLimit,
  updateUserMultitap,
  updateUserTapGuru,
} from "../controller/user.controller";

const router = express.Router();

//users routes
router.post("/user/reg", registerUserHandler);
router.get("/user/:userId", getCurrentUser);
router.post("/user/update/limit/:userId", updateUserLimit);
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
router.post("/task/submit/special/:userId/:taskId", submitSpecialTask);
router.post("/task/special/submit/user_activity/:userId/:taskId", submitUserActivity);
router.post("/task/special/user_activity/:userId", getAllUserActivityById);
router.get("/task/special/user_activity/all", getAllUserActivity);
router.post("/task/ref/submit", submitRefTask);
router.post("/task/league/submit", submitLeagueTask);
router.get("/task/user-task/all", getAllUserTask);

//boosts routes
router.post("/boost/create", createBoost);
router.get("/boost/:boostId", getSingleBoost);
router.get("/boost/:type/all", getAllBoostByType);
router.post("/boost/submit", submitBoost);
router.patch("/user/:userId/tapguru", updateUserTapGuru);
router.patch("/user/:userId/energy", updateUserFullEnergyBar);
router.patch("/user/:userId/multitap", updateUserMultitap);

//stats
router.get("/stats", getStats);

export default router;
