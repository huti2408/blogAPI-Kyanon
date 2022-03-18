import { Router } from "express";
import CategoryController from "../Controllers/CategoryController";
import isValidCate from "../validator/CategoryValidator";

const router = Router();

router.get("/", CategoryController.GetAllCategorys);
router.post("/", isValidCate, CategoryController.CreateCategory);
router.get("/:id", CategoryController.GetCategory);
router.put("/:id", isValidCate, CategoryController.UpdateCategory);
router.delete("/:id", CategoryController.DeleteCategory);
export default router;
