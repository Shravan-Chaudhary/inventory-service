import app from "./app";
import config from "config";
import initDb from "./config/db";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = config.get("server.port") ?? 5502;

    try {
        // Initialize database
        const connection = await initDb();
        logger.info("DATABASE_CONNECTION", {
            meta: {
                CONNECTION_NAME: connection.name
            }
        });

        // Start Application
        app.listen(PORT, () => {
            logger.info("APPLICATION_STARTED", {
                meta: {
                    PORT: PORT,
                    SERVER_URL: config.get("server.url")
                }
            });
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error("APPLICATION_ERROR", {
                meta: error
            });
            process.exit(1);
        }
    }
};

void startServer();
