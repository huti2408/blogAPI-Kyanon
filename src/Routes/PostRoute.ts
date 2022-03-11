import { Router } from "express";
import PostController from "../Controllers/PostController";
import CheckPermission from "../middlewares/CheckPermission";
import Permission from "../constants/ActionPermission";




const router = Router();

router.get("/",CheckPermission(Permission.RESOURCE.POST,Permission.ACTIONS.READ),PostController.GetAllPosts)
router.post("/",CheckPermission(Permission.RESOURCE.POST,Permission.ACTIONS.WRITE),PostController.CreatePost)
router.get("/:id",CheckPermission(Permission.RESOURCE.POST,Permission.ACTIONS.READ),PostController.GetPost)
router.put("/:id",CheckPermission(Permission.RESOURCE.POST,Permission.ACTIONS.WRITE),PostController.UpdatePost)
router.delete("/:id",CheckPermission(Permission.RESOURCE.POST,Permission.ACTIONS.WRITE),PostController.DeletePost)
export default router;