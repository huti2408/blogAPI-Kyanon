import { Router } from "express";
import { body, CustomValidator, validationResult } from "express-validator";

import UserController from "../Controllers/UserController";
import Authentication from "../middlewares/Authentication";
import { isValidRegister, isValidLogin, isValidUser } from "../validator/UserValidator";
const router = Router();

router.get("/", UserController.GetAllUsers);
router.post("/register", isValidRegister, UserController.Register);
router.post("/login", isValidLogin, UserController.Login);
router.get("/:id", Authentication, UserController.GetUser);
router.put("/:id", Authentication, isValidUser, UserController.UpdateUser);
router.delete("/:id", Authentication, UserController.DeleteUser);
router.post("/logout", Authentication, UserController.LogOut);
export default router;
