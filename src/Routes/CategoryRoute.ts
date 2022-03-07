import { Router } from "express";
import CategoryController from "../Controllers/CategoryController";

const router = Router();

router.get("/",CategoryController.GetAllCategorys)
router.post("/",CategoryController.CreateCategory)
router.get("/:id",CategoryController.GetCategory)
router.put("/:id",CategoryController.UpdateCategory)
router.delete("/:id",CategoryController.DeleteCategory)
export default router;