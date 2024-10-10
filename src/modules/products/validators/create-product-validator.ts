import { checkSchema } from "express-validator";

export const createProductValidator = checkSchema({
    name: {
        notEmpty: true,
        errorMessage: "Name is required and must be a string"
    },
    description: {
        isString: true,
        notEmpty: true,
        errorMessage: "Description is required and must be a string"
    },
    priceConfiguration: {
        isObject: true,
        errorMessage: "Price configuration must be an object if provided"
    },
    attributes: {
        isArray: true,
        errorMessage: "Attributes must be an array if provided"
    },
    tenantId: {
        isString: true,
        notEmpty: true,
        errorMessage: "Tenant ID is required and must be a string"
    },
    categoryId: {
        isMongoId: true,
        errorMessage: "Category ID must be a valid MongoDB ObjectId if provided"
    },
    isPublished: {
        optional: true,
        isBoolean: true,
        errorMessage: "isPublished must be a boolean if provided"
    }
});
