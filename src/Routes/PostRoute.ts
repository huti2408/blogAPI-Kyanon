import { Router } from "express";
import PostController from "../Controllers/PostController";
import Authentication from "../middlewares/Authentication"
import CheckPermission from "../middlewares/CheckPermission";
import Action from "../constants/ActionPermission";




const router = Router();

router.get("/",CheckPermission(Action.READ_POST),PostController.GetAllPosts)
router.post("/",CheckPermission(Action.WRITE_POST),Authentication,PostController.CreatePost)
router.get("/:id",CheckPermission(Action.READ_POST),Authentication,PostController.GetPost)
router.put("/:id",Authentication,PostController.UpdatePost)
router.delete("/:id",Authentication,PostController.DeletePost)
export default router;