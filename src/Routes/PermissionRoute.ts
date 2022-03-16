import { Router } from "express";
import PermissionController from "../Controllers/PermissionController";



const router = Router();
router.get('/',PermissionController.GetAllPermissions)
router.post('/',PermissionController.AssignPermission)
// router.put('/',PermissionController.UpdatePermission)
router.delete('/',PermissionController.DeletePermission)


export default router