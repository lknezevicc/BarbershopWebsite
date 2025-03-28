import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { admin, protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, admin, UserController.getUsers);
router.get("/:id", protect, UserController.getUser);
router.put("/:id", protect,  UserController.editUser);
router.delete("/:id", protect, admin, UserController.deleteUser);
router.patch("/:id/change-role", protect, admin,  UserController.changeRole);
router.patch("/:id/change-password", protect, UserController.changePassword);

export default router;