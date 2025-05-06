import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import path from "path";
import ResponseMessage from "./common/constants/responseMessage";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import { httpResponse, CreateHttpError, HttpStatus } from "./common/http";
import { getApplicationHealth, getSystemHealth } from "./common/utils/quicker";
import categoryRouter from "./modules/categories/category-router";
import Config from "./config";
import cookieParser from "cookie-parser";
import productRouter from "./modules/products/product-router";
import toppingRouter from "./modules/toppings/topping-router";

const app: Application = express();
const ALLOWED_DOMAINS = [Config.CORS_CLIENT_URL as string, Config.CORS_ADMIN_URL as string];

// Middlewares
app.use(helmet());
app.use(
    cors({
        origin: ALLOWED_DOMAINS,
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use(`${Config.BASE_URL}/categories`, categoryRouter);
app.use(`${Config.BASE_URL}/products`, productRouter);
app.use(`${Config.BASE_URL}/toppings`, toppingRouter);

// Health check
app.get(`${Config.BASE_URL}/health`, (req: Request, res: Response) => {
    const healthData = {
        application: getApplicationHealth(),
        system: getSystemHealth(),
        timeStamp: Date.now()
    };

    httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, healthData);
});

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
    try {
        const error = CreateHttpError.NotFoundError("Route not found");
        throw error;
    } catch (error) {
        next(error);
    }
});

// Global error handler
app.use(globalErrorHandler);

export default app;
