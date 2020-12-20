type ConfigurationValue =
    | string
    | number
    | Array<unknown>
    | Record<string, unknown>
    | boolean;

type Configuration = {
    id: string;
    name: string;
    value: ConfigurationValue;
};

type PartialConfiguration = {
    id?: string;
    name?: string;
    value?: ConfigurationValue;
};

type ConfigurationStorage =
    | Record<string, Configuration>
    | Record<string, never>;

type ConfigurationSet =
    | Record<string, ConfigurationValue>
    | Record<string, never>;

interface ConfigurationStore {
    get: (configId?: string) => ConfigurationSet;
    set: (configId: string, payload: Configuration) => boolean;
    update: (configId: string, payload: PartialConfiguration) => boolean;
}

export type {
    Configuration,
    ConfigurationValue,
    ConfigurationStorage,
    ConfigurationStore,
    ConfigurationSet,
    PartialConfiguration,
};
