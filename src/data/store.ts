import { StoreFactory } from "../class/StoreFactory";

const dbType =
    process.env.DB_TYPE === undefined
        ? "Redis"
        : ((process.env.DB_TYPE as unknown) as "Memory" | "Redis");

const store = StoreFactory(dbType);

export { store };
