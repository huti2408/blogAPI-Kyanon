import { Router } from "express";
import PermissionController from "../Controllers/PermissionController";



const router = Router();
router.get('/',PermissionController.GetAllPermissions)
router.post('/',PermissionController.AssignPermission)
router.put('/:id',PermissionController.UpdatePermission)
router.delete('/:id',PermissionController.DeletePermission)


export default router