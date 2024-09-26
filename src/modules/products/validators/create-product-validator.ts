import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("product name is required")
        .isString()
        .withMessage("product name must be a string")
        .notEmpty()
        .withMessage("product name cannot be empty"),
    body("description")
        .notEmpty()
        .withMessage("description cannot be empty")
        .isString()
        .withMessage("description must be a string"),
    body("image").custom((_value, { req }) => {
        if (!req.files) throw new Error(`product image is required`);
        return true;
    }),
    body("priceConfiguration")
        .notEmpty()
        .withMessage("priceconfiguration cannot be empty")
        .isString()
        .withMessage("priceconfiguration must be a string"),
    body("attributes")
        .exists()
        .withMessage("attributes are required")
        .notEmpty()
        .withMessage("attributes cannot be empty"),
    body("tenantId")
        .notEmpty()
        .withMessage("tenant id cannot be empty")
        .isString()
        .withMessage("tenant id must be a string"),
    body("categoryId").notEmpty().withMessage("category id cannot be empty")
];
