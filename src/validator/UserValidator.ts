import { check } from "express-validator";

export const isValidRegister = [
   check("email").isEmail().normalizeEmail().withMessage("Invalid Email").notEmpty().withMessage("Email can't be empty").isLength({ min: 10 }).withMessage("Email has to be at least 10 characters"),
   check("password").trim().notEmpty().withMessage("Password can't be empty").isLength({ min: 6 }).withMessage("Password has to be at least 6 characters"),
   //    check("mobile").isEmpty().isString().isLength({ min: 10, max: 11 }).isNumeric().withMessage("Invalid mobile"),
];
export const isValidLogin = [
   check("email").isEmail().normalizeEmail().withMessage("Invalid Email").notEmpty().withMessage("Email can't be empty").isLength({ min: 10 }).withMessage("Email has to be at least 10 characters"),
   check("password").trim().notEmpty().withMessage("Password can't be empty").isLength({ min: 6 }).withMessage("Password has to be at least 6 characters"),
];
export const isValidUser = [
   check("email").isEmail().normalizeEmail().withMessage("Invalid Email").notEmpty().withMessage("Email can't be empty").isLength({ min: 10 }).withMessage("Email has to be at least 10 characters"),
   check("password").trim().notEmpty().withMessage("Password can't be empty").isLength({ min: 6 }).withMessage("Password has to be at least 6 characters"),
   check(["firstName", "lastName"]).trim().notEmpty().withMessage("Name cant be null").isLength({ max: 32 }).withMessage("Name cant be more than 32 characters"),
   check("mobile").isEmpty().isString().isLength({ min: 10, max: 11 }).isNumeric().withMessage("Invalid mobile"),
];
