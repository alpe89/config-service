import {
    ConfigurationStore,
    ConfigurationSet,
    ConfigurationStorage,
    Configuration,
    PartialConfiguration,
} from "./types";
import { isConfiguration } from "./validation/payload";
/**
 * This class represents the Storage of the service,
 * at the moment configurations are stored inside a normal
 * Javascript Object, every key is directly linked to the
 * Configuration's ID
 */
export class Store implements ConfigurationStore {
    private store: ConfigurationStorage;
    /**
     * Class constructor, initializes to a blank storage or
     * if it is provided an initial Configuration Storage it
     * can pick up from that state.
     *
     * @param initialStore
     */
    constructor(initialStore: ConfigurationStorage = {}) {
        this.store = initialStore;
    }
    /**
     * Simply retrieve the configuration value for a single key and,
     * if omitted, returns the configuration values for every stored
     * key.
     *
     * @param key The key to retrieve the configuration value for
     * @return {ConfigurationSet}
     */
    get(key?: string): ConfigurationSet {
        const resultSet: ConfigurationSet = {};
        if (!key) {
            Object.keys(this.store).forEach(key => {
                resultSet[key] = this.store[key].value;
            });
        } else if (this.store[key]) {
            resultSet[key] = this.store[key].value;
        }

        return resultSet;
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
    set(key: string, payload: Configuration): boolean {
        if (!this.store[key]) {
            this.store[key] = payload;
            return true;
        }
        return false;
    }
    /**
     * After the check of the existance of the key in the store,
     * an override between the previous data and the provided one is made.
     * After a check to ensure that the new configuration is valid we delete the old one
     * and store the new one calling the set method.
     *
     * @param key The key to update the configuration for
     * @param payload The actual data to update the store
     */
    update(key: string, payload: PartialConfiguration): boolean {
        if (!this.store[key]) return false;

        const config: Configuration = { ...this.store[key], ...payload };

        if (!isConfiguration(config)) return false;

        delete this.store[key];
        const newKey = config.id;
        const updatedStore = this.set(newKey, config);

        return updatedStore;
    }
}
