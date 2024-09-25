import express, { Request, Response, NextFunction } from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../../config/logger";
import asyncHandler from "../../common/utils/asyncHandler";
import authenticate from "../../common/middlewares/authenticate";
import canAccess from "../../common/middlewares/canAccess";
import { Roles } from "../../constants";
const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await categoryController.create(req, res, next);
    })
);

export default router;
