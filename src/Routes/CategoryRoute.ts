import { Router } from "express";
import Permission from "../constants/ActionPermission";
import CategoryController from "../Controllers/CategoryController";
import CheckPermission from "../middlewares/CheckPermission";



const router = Router();

router.get("/",CheckPermission(Permission.RESOURCE.CATE,Permission.ACTIONS.READ),CategoryController.GetAllCategorys)
router.post("/",CheckPermission(Permission.RESOURCE.CATE,Permission.ACTIONS.WRITE),CategoryController.CreateCategory)
router.get("/:id",CheckPermission(Permission.RESOURCE.CATE,Permission.ACTIONS.READ),CategoryController.GetCategory)
router.put("/:id",CheckPermission(Permission.RESOURCE.CATE,Permission.ACTIONS.WRITE),CategoryController.UpdateCategory)
router.delete("/:id",CheckPermission(Permission.RESOURCE.CATE,Permission.ACTIONS.WRITE),CategoryController.DeleteCategory)
export default router;