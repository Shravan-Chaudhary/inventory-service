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

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req: Request, res: Response) => {
    httpResponse(req, res, HttpStatus.OK, ResponseMessage.SUCCESS, {
        port: Config.PORT
    });
});

app.use(`${Config.BASE_URL}/categories`, categoryRouter);
app.use(`${Config.BASE_URL}/products`, productRouter);

// Health check
app.get("/api/v1/health", (req: Request, res: Response) => {
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
