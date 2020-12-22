import chalk from "chalk";
import * as dotenv from "dotenv";
// In Local development we use the environment variables in the .env file
if (process.env.NODE_ENV === "local") {
    dotenv.config();
}
import { makeServer } from "./server/app";
import { store } from "./data/store";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT = +process.env.PORT! ?? 3456;

const app = makeServer(store);

app.listen(PORT, () => {
    console.log(
        `⚡️ ${chalk.cyan(
            "[Config-Service]:"
        )} Service is running on port ${chalk.magenta(PORT)}`
    );
});
