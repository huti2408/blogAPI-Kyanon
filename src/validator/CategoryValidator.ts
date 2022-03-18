import { check } from "express-validator";
const isValidCate = [
   check("title").notEmpty().withMessage("Title can't be empty").isString().trim().withMessage("Invalid title").isLength({ min: 10, max: 155 }).withMessage("Title must have at least 10 characters"),
   check("slug").notEmpty().withMessage("Slug can't be empty").isString().trim().withMessage("Invalid slug"),
   check("content").notEmpty().withMessage("Content can't be empty").isString().withMessage("Invalid content"),
];
export default isValidCate;
