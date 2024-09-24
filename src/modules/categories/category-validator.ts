import { body } from "express-validator";
import { EPricetype } from "./types";

export default [
    body("name")
        .exists()
        .withMessage("category name is required")
        .isString()
        .withMessage("category name must be a string")
        .notEmpty()
        .withMessage("category name cannot be empty"),

    body("priceConfiguration")
        .exists()
        .withMessage("price configuration is required")
        .notEmpty()
        .withMessage("price configuration cannot be empty"),
    body("priceConfiguration.*.priceType")
        .exists()
        .withMessage("price type is required")
        .custom((value: EPricetype.BASE | EPricetype.ADDITIONAL) => {
            const validKeys = [EPricetype.BASE, EPricetype.ADDITIONAL];
            if (!validKeys.includes(value)) {
                throw new Error(`price type must be either: ${validKeys.join(", ")}`);
            }
            return true;
        })
        .notEmpty()
        .withMessage("price type cannot be empty"),
    body("attributes")
        .exists()
        .withMessage("attributes are required")
        .notEmpty()
        .withMessage("attributes cannot be empty")
];
