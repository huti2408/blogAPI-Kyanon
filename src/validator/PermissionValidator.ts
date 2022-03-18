import { check } from "express-validator";
const isValidPermission = [
   check("userId").notEmpty().withMessage("userId can't be null").isInt().withMessage("Invalid userId"),
   check("permissionId").notEmpty().withMessage("permissionID can't be null").isInt().withMessage("Invalid permissionId"),
   check("note").isString().isLength({ min: 5, max: 100 }).withMessage("note must has at least 5 characters and maxium is 100 characters"),
];
export default isValidPermission;
