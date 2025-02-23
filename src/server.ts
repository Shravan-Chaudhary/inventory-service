import app from "./app";
import Config from "./config";
import initDb from "./config/db";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = Config.PORT ?? 5502;

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
                    SERVER_URL: Config.SERVER_URL
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
