import { Router } from "express";
import Action from "../constants/ActionPermission";
import CategoryController from "../Controllers/CategoryController";
import Authentication from "../middlewares/Authentication"
import CheckPermission from "../middlewares/CheckPermission";



const router = Router();

router.get("/",CheckPermission(Action.READ_CATGORY),Authentication,CategoryController.GetAllCategorys)
router.post("/",CheckPermission(Action.WRITE_CATEGORY),Authentication,CategoryController.CreateCategory)
router.get("/:id",Authentication,CheckPermission(Action.READ_CATGORY),CategoryController.GetCategory)
router.put("/:id",Authentication,CategoryController.UpdateCategory)
router.delete("/:id",Authentication,CategoryController.DeleteCategory)
export default router;