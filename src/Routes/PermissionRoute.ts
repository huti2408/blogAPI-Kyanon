import { Router } from "express";
import PermissionController from "../Controllers/PermissionController";
import isValidPermission from "../validator/PermissionValidator";

const router = Router();
router.get("/", PermissionController.GetAllPermissions);
router.post("/", isValidPermission, PermissionController.AssignPermission);
// router.put('/',PermissionController.UpdatePermission)
router.delete("/", PermissionController.DeletePermission);

export default router;
