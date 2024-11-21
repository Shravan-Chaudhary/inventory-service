import express from "express";
import asyncHandler from "../../common/utils/asyncHandler";
import { ProductService } from "./product-service";
import { ProductController } from "./product-controller";
import logger from "../../config/logger";
import fileUpload from "express-fileupload";
import { S3StorageService } from "../s3-storage/s3-storage-service";
import { CreateHttpError } from "../../common/http";
import authenticate from "../../common/middlewares/authenticate";
import canAccess from "../../common/middlewares/canAccess";
import { ERoles } from "../../constants";

const router = express.Router();

const productService = new ProductService();
const s3StorageService = new S3StorageService();
const productController = new ProductController(productService, s3StorageService, logger);

// public routes
router.get(
    "/",
    asyncHandler(async (req, res) => {
        await productController.index(req, res);
    })
);

// private routes
router.post(
    "/",
    authenticate,
    canAccess([ERoles.ADMIN, ERoles.MANAGER]),
    fileUpload({
        limits: {
            fileSize: 500 * 1024 // 500 KB
        },
        abortOnLimit: true,
        limitHandler: (_req, _res, next) => {
            const err = CreateHttpError.BadRequestError(`File size should not exceed 500 KB`);
            next(err);
        }
    }),
    asyncHandler(async (req, res) => {
        await productController.create(req, res);
    })
);

router.put(
    "/:id",
    authenticate,
    canAccess([ERoles.ADMIN, ERoles.MANAGER]),
    fileUpload({
        limits: {
            fileSize: 500 * 1024 // 500 KB
        },
        abortOnLimit: true,
        limitHandler: (_req, _res, next) => {
            const err = CreateHttpError.BadRequestError(`File size should not exceed 500 KB`);
            next(err);
        }
    }),
    asyncHandler(async (req, res) => {
        await productController.update(req, res);
    })
);

export default router;
