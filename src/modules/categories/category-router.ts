import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler
} from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";

const router = express.Router();

const categoryController = new CategoryController();

router.post("/", categoryValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await categoryController.create(req, res, next);
}) as unknown as RequestHandler);

export default router;
