import app from "./app";
import { createMessageProducerBroker } from "./common/factories/brokerFactory";
import Config from "./config";
import initDb from "./config/db";
import logger from "./config/logger";
import { MessageProducerBroker } from "./types/broker";

const startServer = async () => {
    const PORT = Config.PORT ?? 5502;

    let messageProducerBroker: MessageProducerBroker | null = null;

    try {
        // Initialize database
        const connection = await initDb();
        logger.info("DATABASE_CONNECTION", {
            meta: {
                CONNECTION_NAME: connection.name
            }
        });

        // Connect to Kafka
        if (!Config.KAFKA_CLIENT_ID) {
            throw new Error("KAFKA_CLIENT_ID is not defined");
        }
        messageProducerBroker = createMessageProducerBroker();
        await messageProducerBroker.connect();

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
            if (messageProducerBroker) {
                await messageProducerBroker.disconnect();
            }
            logger.error("APPLICATION_ERROR", {
                meta: error
            });
            process.exit(1);
        }
    }
};

void startServer();
