import express from "express";
import asyncHandler from "../../common/utils/asyncHandler";
import { ProductService } from "./product-service";
import { ProductController } from "./product-controller";
import createProductValidator from "./validators/create-product-validator";
import logger from "../../config/logger";
import fileUpload from "express-fileupload";

const router = express.Router();

const productService = new ProductService();
const productController = new ProductController(productService, logger);

//TODO: Add File upload middleware
router.post(
    "/",
    createProductValidator,
    fileUpload(),
    asyncHandler(async (req, res) => {
        await productController.create(req, res);
    })
);

export default router;
