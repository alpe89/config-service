/* eslint-disable @typescript-eslint/no-non-null-assertion */
import redis from "redis";
import { ConfigurationStore } from "../types";
import { MemoryStore } from "./MemoryStore";
import { RedisStore } from "./RedisStore";

export function StoreFactory(
    type: "Memory" | "Redis" = "Redis"
): ConfigurationStore {
    if (type === "Redis") {
        try {
            const client = redis.createClient({
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT!,
                db: process.env.REDIS_DN,
                retry_strategy: function (options) {
                    if (
                        options.error &&
                        options.error.code === "ECONNREFUSED"
                    ) {
                        // End reconnecting on a specific error and flush all commands with
                        // a individual error
                        throw new Error("The server refused the connection");
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        // End reconnecting after a specific timeout and flush all commands
                        // with a individual error
                        throw new Error("Retry time exhausted");
                    }
                    if (options.attempt > 10) {
                        // End reconnecting with built in error
                        return undefined;
                    }
                    // reconnect after
                    Math.min(options.attempt * 100, 3000);
                },
            });

            if (!client) throw new Error("Unable to connecto to redis...");

            client.on("error", err => console.error(err));

            client.on("connect", () => console.log("Connected to Redis..."));

            return new RedisStore(client);
        } catch (err) {
            console.error(err);
            return new MemoryStore({});
        }
    }

    return new MemoryStore({});
}
