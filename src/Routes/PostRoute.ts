import { Router } from "express";
import PostController from "../Controllers/PostController";
import isValidPost from "../validator/PostValidator";

const router = Router();

router.get("/", PostController.GetAllPosts);
router.post("/", isValidPost, PostController.CreatePost);
router.get("/:id", PostController.GetPost);
router.put("/:id", isValidPost, PostController.UpdatePost);
router.delete("/:id", PostController.DeletePost);
export default router;
