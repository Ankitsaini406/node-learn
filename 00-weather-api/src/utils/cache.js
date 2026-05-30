import { redisClient } from "../config/redis.js"


const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.log(error);
        return null;
    }
};


const setCache = async (key, value, expiry = 120) => {
    try {
        await redisClient.setEx(
            key,
            expiry,
            JSON.stringify(value)
        );
    } catch (error) {
        console.log(error);
    }
};

export { getCache, setCache };