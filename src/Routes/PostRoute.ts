import { Router } from "express";
import PostController from "../Controllers/PostController";




const router = Router();

router.get("/",PostController.GetAllPosts)
router.post("/",PostController.CreatePost)
router.get("/:id",PostController.GetPost)
router.put("/:id",PostController.UpdatePost)
router.delete("/:id",PostController.DeletePost)
export default router;