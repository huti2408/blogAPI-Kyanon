import { Router } from "express";
import PostController from "../Controllers/PostController";
import Authentication from "../middlewares/Authentication"
import CheckJWT from "../middlewares/CheckJWT"


const router = Router();

router.get("/",PostController.GetAllPosts)
router.post("/",Authentication,CheckJWT,PostController.CreatePost)
router.get("/:id",Authentication,CheckJWT,PostController.GetPost)
router.put("/:id",Authentication,CheckJWT,PostController.UpdatePost)
router.delete("/:id",Authentication,CheckJWT,PostController.DeletePost)
export default router;