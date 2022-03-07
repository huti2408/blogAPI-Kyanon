import { Router } from "express";
import PostController from "../Controllers/PostController";
import Authentication from "../middlewares/Authentication"


const router = Router();

router.get("/",PostController.GetAllPosts)
router.post("/",Authentication,PostController.CreatePost)
router.get("/:id",Authentication,PostController.GetPost)
router.put("/:id",Authentication,PostController.UpdatePost)
router.delete("/:id",Authentication,PostController.DeletePost)
export default router;