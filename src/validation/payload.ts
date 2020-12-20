import { Configuration, ConfigurationValue } from "../types";
/**
 * This checks if the supplied configuration is valid using the
 * Configuration custom interface
 *
 * @param data Configuration type object of the Payload
 * @return boolean
 */
function isConfiguration(data: Record<string, unknown>): data is Configuration {
    if (Object.keys(data).length !== 3) return false;
    if (!data.id || typeof data.id !== "string") return false;
    if (!data.name || typeof data.name !== "string") return false;
    if (!data.value || !isConfigurationValue(data.value)) return false;

    return true;
}
/**
 * This checks if the supplied value in the Payload is a "jsonable"
 * value
 *
 * @param data Value type of the Payload
 * @return boolean
 */
function isConfigurationValue(data: unknown): data is ConfigurationValue {
    try {
        JSON.stringify(data);
        return true;
    } catch (err) {
        return false;
    }
}

export { isConfiguration, isConfigurationValue };
