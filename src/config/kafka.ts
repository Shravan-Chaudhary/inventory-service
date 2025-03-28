import { Kafka, KafkaConfig, Producer } from "kafkajs";
import { MessageProducerBroker } from "../types/broker";
import Config from ".";

export class KafkaProducerBroker implements MessageProducerBroker {
    private producer: Producer;

    constructor(clientId: string, brokers: string[]) {
        let kafkaConfig: KafkaConfig = { clientId, brokers };
        if (process.env.NODE_ENV === "production") {
            kafkaConfig = {
                ...kafkaConfig,
                ssl: true,
                connectionTimeout: 45000,
                sasl: {
                    mechanism: "plain",
                    username: Config.SASL_USERNAME!,
                    password: Config.SASL_PASSWORD!
                }
            };
        }
        const kafka = new Kafka(kafkaConfig);
        this.producer = kafka.producer();
    }
    async connect() {
        await this.producer.connect();
    }
    async disconnect() {
        if (this.producer) await this.producer.disconnect();
    }

    /**
     *
     * @param topic -- The topic to send message to
     * @param message -- The message to send
     * @throws {Error}
     */
    async sendMessage(topic: string, message: string) {
        await this.producer.send({
            topic,
            messages: [{ value: message }]
        });
    }
}
