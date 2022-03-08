import { Router } from "express";
import CategoryController from "../Controllers/CategoryController";
import Authentication from "../middlewares/Authentication"
import CheckJWT from "../middlewares/CheckJWT";

const router = Router();

router.get("/",CategoryController.GetAllCategorys)
router.post("/",Authentication,CheckJWT,CategoryController.CreateCategory)
router.get("/:id",Authentication,CheckJWT,CategoryController.GetCategory)
router.put("/:id",Authentication,CheckJWT,CategoryController.UpdateCategory)
router.delete("/:id",Authentication,CheckJWT,CategoryController.DeleteCategory)
export default router;