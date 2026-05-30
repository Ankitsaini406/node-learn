import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
    console.log(`Redis Error: ${err}`);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();

        console.log("Redis Connected");
    } catch (error) {
        console.log(`Redis Connection Failed: ${error}`);
    }
};

export { redisClient, connectRedis };