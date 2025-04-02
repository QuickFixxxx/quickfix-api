import Redis, { RedisOptions } from "ioredis";
import { environmentVar } from "./env";

const redisConfig: RedisOptions = {
  host: environmentVar.REDIS_HOST,
  port: parseInt(environmentVar.REDIS_PORT, 10),
  username: environmentVar.REDIS_USERNAME,
  password: environmentVar.REDIS_PASSWORD,
};

const redisClient = new Redis(redisConfig);

export default redisClient;
