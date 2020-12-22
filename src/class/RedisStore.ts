import { promisify } from "util";
import { RedisClient } from "redis";
import {
    ConfigurationStore,
    ConfigurationSet,
    Configuration,
    PartialConfiguration,
} from "../types";
import { isConfiguration } from "../validation/payload";

export class RedisStore implements ConfigurationStore {
    private instance: RedisClient;
    private getRedisKeys: (pattern: string) => Promise<string[]>;
    private getRedisValue: (key: string) => Promise<string | null>;
    private setRedisKey: (key: string, value: string) => Promise<unknown>;
    private delRedisKey: (args: unknown) => Promise<number>;

    constructor(instance: RedisClient) {
        this.instance = instance;
        this.getRedisKeys = promisify(this.instance.keys).bind(this.instance);
        this.getRedisValue = promisify(this.instance.get).bind(this.instance);
        this.setRedisKey = promisify(this.instance.set).bind(this.instance);
        this.delRedisKey = promisify(this.instance.del).bind(this.instance);
    }
    /**
     * Simply retrieve the configuration value for a single key and,
     * if omitted, returns the configuration values for every stored
     * key.
     *
     * @param key The key to retrieve the configuration value for
     * @return {ConfigurationSet}
     */
    async get(key?: string): Promise<ConfigurationSet> {
        const resultSet: ConfigurationSet = {};

        if (!key) {
            const redisKeys = await this.getRedisKeys("*");

            const redisValues = await this.getValues(redisKeys);

            for (let i = 0; i < redisKeys.length; i++) {
                if (typeof redisValues[i] === "string") {
                    try {
                        const parsedValue = JSON.parse(
                            redisValues[i] as string
                        );
                        resultSet[redisKeys[i]] = parsedValue.value;
                    } catch (err) {
                        console.error(err);
                    }
                }
            }

            return resultSet;
        } else {
            const redisValue = await this.getRedisValue(key);
            // No key saved in Redis
            if (!redisValue) return resultSet;
            try {
                resultSet[key] = JSON.parse(redisValue).value;
                return resultSet;
            } catch (err) {
                console.error(err);
                return resultSet;
            }
        }
    }
    /**
     * This helper function takes an array of keys to search the value for,
     * and returns a promise that resolves to an array of values in the same
     * order of the keys. If the key is not in the store, null is returned.
     *
     * @param keys An array of Keys to search the values for
     */
    private async getValues(keys: string[]): Promise<(string | null)[]> {
        return new Promise((resolve, reject) => {
            const redisPromises: Promise<string | null>[] = [];

            keys.forEach(key => redisPromises.push(this.getRedisValue(key)));

            Promise.all(redisPromises).then(
                results => {
                    resolve(results);
                },
                err => {
                    console.error(err);
                    reject([]);
                }
            );
        });
    }
    /**
     * Store a Configuration type of data with key equal to the Configuration's ID
     * value. It will store the configuration only if there is no configuration
     * with the same key already in memory. To update a configuration key use
     * the update method.
     *
     * @param key The key to store the configuration for
     * @param payload The actual data to store
     */
    async set(key: string, payload: Configuration): Promise<boolean> {
        if (!isConfiguration(payload)) {
            console.log("Configuration is not valid");
            return false;
        }

        if (await this.getRedisValue(key)) {
            console.log(`Key [${key}] already in memory`);
            return false;
        }

        try {
            const isStoreUpdated = await this.setRedisKey(
                key,
                JSON.stringify(payload)
            );
            return isStoreUpdated !== undefined;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    /**
     * After the check of the existance of the key in the store,
     * an override between the previous data and the provided one is made.
     * After a check to ensure that the new configuration is valid we delete the old one
     * and store the new one calling the set method. This method is not intented to
     * insert new keys in the store, for that purpose use the set method.
     *
     * @param key The key to update the configuration for
     * @param payload The actual data to update the store
     */
    async update(key: string, payload: PartialConfiguration): Promise<boolean> {
        const redisValue = await this.getRedisValue(key);
        if (redisValue === null) return false;

        try {
            const value = JSON.parse(redisValue);

            const shouldDeleteKey = payload.id && payload.id !== key;

            const config: Configuration = { ...value, ...payload };

            if (!isConfiguration(config)) return false;

            const newKey = config.id;

            const updatedStore = await this.setRedisKey(
                newKey,
                JSON.stringify(config)
            );

            if (updatedStore !== undefined && shouldDeleteKey) {
                const configDeleted = await this.delete(key);
                if (!configDeleted) return false;
            }

            return updatedStore !== undefined;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    /**
     * Deletes the configuration identified by the key if exists.
     *
     * @param key The key to delete the configuration for
     */
    async delete(key: string): Promise<boolean> {
        const redisValue = await this.getRedisValue(key);
        if (redisValue === null) return false;

        const deleted = await this.delRedisKey(key);

        if (deleted === 1) return true;
        return false;
    }
}
