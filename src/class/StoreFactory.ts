/* eslint-disable @typescript-eslint/no-non-null-assertion */
import redis from "redis";
import { ConfigurationStore, StorageType } from "../types";
import { MemoryStore } from "./MemoryStore";
import { RedisStore } from "./RedisStore";
/**
 * This is a "Factory Pattern", basically we decide at runtime which type
 * of Storage to use.
 * This stands as an example, and is not a production ready solution.
 *
 * @param type Storage Type, "Redis" or "Memory"
 */
export function StoreFactory(type: StorageType = "Memory"): ConfigurationStore {
    if (type === "Redis") {
        const client = redis.createClient({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT!,
            retry_strategy: function (options) {
                if (options.error && options.error.code === "ECONNREFUSED") {
                    // End reconnecting on a specific error and flush all commands with
                    // a individual error
                    return new Error("The server refused the connection");
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands
                    // with a individual error
                    return new Error("Retry time exhausted");
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            },
        });

        client.on("error", err => {
            console.error("Fatal Error, Redis Crashed: " + err.origin.message);
            console.error("Process is exiting with error...");
            process.exit(1);
        });

        return new RedisStore(client);
    }

    if (type === "Memory") return new MemoryStore({});

    return new MemoryStore({});
}
