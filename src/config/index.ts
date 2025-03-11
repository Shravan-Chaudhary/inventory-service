import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const Config = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    JWKS_URI: process.env.JWKS_URI,
    BASE_URL: process.env.BASE_URL,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    CORS_CLIENT_URL: process.env.CORS_CLIENT_URL,
    CORS_ADMIN_URL: process.env.CORS_ADMIN_URL,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID
};

export default Config;
