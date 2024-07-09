import { Redis } from "ioredis";
import Logger from "./logger";

const logger = new Logger()

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || ''),
});

redis.on('error', (error) => {
    logger.error(`Redis error: ${error}`);
})

export default redis;