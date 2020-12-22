import chalk from "chalk";
import * as dotenv from "dotenv";
// In Local development we use the environment variables in the .env file
if (process.env.NODE_ENV === "local") {
    dotenv.config();
}
import { app } from "./server/app";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT = +process.env.PORT! ?? 3456;

app.listen(PORT, () => {
    console.log(
        `⚡️ ${chalk.cyan(
            "[Config-Service]:"
        )} Service is running on port ${chalk.magenta(PORT)}`
    );
});
