import { Router } from "express";
import UserController from "../Controllers/UserController";
import Authentication from "../middlewares/Authentication"

const router = Router();

router.get("/",UserController.GetAllUsers)
router.post("/register",UserController.Register)
router.post("/login",UserController.Login)
router.get("/:id",Authentication,UserController.GetUser)
router.put("/:id",Authentication,UserController.UpdateUser)
router.delete("/:id",Authentication,UserController.DeleteUser)
export default router;