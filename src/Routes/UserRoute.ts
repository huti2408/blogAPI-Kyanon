import { Router } from "express";
import UserController from "../Controllers/UserController";
import Authentication from "../middlewares/Authentication"

const router = Router();

router.get("/",UserController.GetAllUsers)
router.post("/register",Authentication,UserController.Register)
router.post("/login",UserController.Login)
router.get("/:id",Authentication,UserController.GetUser)
router.put("/:id",Authentication,UserController.UpdateUser)
router.delete("/:id",Authentication,UserController.DeleteUser)
router.post("/logout",Authentication,UserController.LogOut)
export default router;