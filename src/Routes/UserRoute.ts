import { Router } from "express";
import UserController from "../Controllers/UserController";

const router = Router();

router.get("/",UserController.GetAllUsers)
router.post("/register",UserController.Register)
router.post("/login",UserController.Login)
router.get("/:id",UserController.GetUser)
router.put("/:id",UserController.UpdateUser)
router.delete("/:id",UserController.DeleteUser)
export default router;