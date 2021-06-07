import * as yargs from "yargs";
import { join } from "path";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

import { addAlias } from "module-alias";
addAlias("@webcarrot/multi-lan-controller", __dirname);

import { makeApp } from "./common/server";
import { homedir } from "os";
import { makeDbAccess } from "./common/db";

const DEFAULT_PORT = 8080;
const DEFAULT_DB_DIR =
  process.env.DB_DIR || join(homedir(), "./multi-lan-controller");

const argv = yargs
  .scriptName("@webcarrot/multi-lan-controller")
  .option("p", {
    alias: "port",
    number: true,
    default: DEFAULT_PORT,
    description: "HTTP port",
    demandOption: true,
  })
  .option("d", {
    string: true,
    description: "Database dir",
    demandOption: true,
    default: DEFAULT_DB_DIR,
  })
  .option("dev-mode", {
    hidden: true,
    boolean: true,
    description: "Dev mode",
    default: false,
  })
  .help().argv;

const bestOff = <T>(v: T | T[]): T =>
  v instanceof Array ? v[v.length - 1] : v;

(async () => {
  const args = await argv;
  const portOrSocket = bestOff(args["p"]);
  try {
    const dbAccess = await makeDbAccess(bestOff(args["d"]));
    const app = await makeApp(dbAccess, bestOff(args["dev-mode"]));
    app.listen(portOrSocket, () => {
      console.info(
        `[${new Date().toLocaleTimeString()}] info: app start listen on ${JSON.stringify(
          portOrSocket
        )}`
      );
    });
  } catch (err) {
    console.error(
      `[${new Date().toLocaleTimeString()}] error: ${JSON.stringify(
        err.message
      )}`
    );
    process.exit(1);
  }
})();
