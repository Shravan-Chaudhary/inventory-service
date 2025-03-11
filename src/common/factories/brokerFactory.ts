import Config from "../../config";
import { KafkaProducerBroker } from "../../config/kafka";
import { MessageProducerBroker } from "../../types/broker";

let messageProducer: MessageProducerBroker | null = null;

export const createMessageProducerBroker = (): MessageProducerBroker => {
    if (!Config.KAFKA_CLIENT_ID) {
        throw new Error("KAFKA_CLIENT_ID is not defined");
    }
    // make it singleton
    // TODO: change brokers to use env vars
    if (!messageProducer) {
        messageProducer = new KafkaProducerBroker(Config.KAFKA_CLIENT_ID, ["localhost:9092"]);
    }
    return messageProducer;
};
