import { check } from "express-validator";
const isValidPost = [
   check("authorId").notEmpty().withMessage("authorId cant be null").isInt().withMessage("Invalid authorId"),
   check("title").notEmpty().withMessage("Title can't be empty").isString().trim().withMessage("Invalid title").isLength({ max: 155 }).withMessage("Title can only have max 155 characters"),
   check("slug")
      .notEmpty()
      .withMessage("Slug can't be empty")
      .isString()
      .trim()
      .withMessage("Invalid slug")
      .isLength({ min: 5, max: 50 })
      .withMessage("Slug must have at least 5 characters and max 155 characters"),
   check("content").notEmpty().withMessage("Content can't be empty").isString().withMessage("Invalid content"),
];
export default isValidPost;
