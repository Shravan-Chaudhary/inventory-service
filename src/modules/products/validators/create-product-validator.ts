import { body } from "express-validator";

export default [
    body("name").notEmpty().withMessage("product name cannot be empty"),
    body("description").notEmpty().withMessage("description cannot be empty"),
    body("image").custom((_value, { req }) => {
        if (!req.files) throw new Error(`product image is required`);
        return true;
    }),
    body("priceConfiguration").notEmpty().withMessage("priceconfiguration cannot be empty"),
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
