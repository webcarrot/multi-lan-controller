const { startNode } = require("./start");
const { buildNode, buildBrowser, buildPackage, buildPack } = require("./build");
const { clear } = require("./clear");
Error.stackTraceLimit = 100;

(async rawEvent => {
  try {
    let mode = "production";
    let fast = false;
    let [event, what, env] = rawEvent.split(":");
    if (what === "dev") {
      what = null;
      fast = true;
      mode = "development";
    } else if (env === "dev") {
      mode = "development";
      fast = true;
    } else if (what === "fast") {
      what = null;
      fast = true;
    } else if (env === "fast") {
      fast = true;
    }
    if (
      what === "server" ||
      what === "node" ||
      what === "browser" ||
      what === "package" ||
      what === "docker"
    ) {
      event = `${event}:${what}`;
    }
    process.env.NODE_ENV = mode;
    switch (event) {
      case "clear":
        await clear(mode);
        break;
      case "start":
        await clear(mode);
        await buildNode(mode);
        await startNode(mode);
        await buildBrowser(mode, fast);
        break;
      case "start:server":
        await startNode(mode);
        break;
      case "build":
        await clear(mode);
        await buildNode(mode);
        await buildBrowser(mode, fast);
        process.exit(0);
        break;
      case "build:package":
        // force production mode
        mode = "production";
        await clear(mode);
        await buildNode(mode);
        await buildBrowser(mode, fast);
        await buildPackage(mode);
        process.exit(0);
        break;
      case "build:docker":
        // force production mode
        mode = "production";
        console.time("build:docker:clear");
        await clear(mode);
        console.timeEnd("build:docker:clear");
        console.time("build:docker:node");
        await buildNode(mode);
        console.timeEnd("build:docker:node");
        console.time("build:docker:browser");
        await buildBrowser(mode, fast);
        console.timeEnd("build:docker:browser");
        console.time("build:docker:pack");
        console.log(`build:docker:version ${await buildPack(mode)}`);
        console.timeEnd("build:docker:pack");
        process.exit(0);
        break;
      case "build:node":
        await buildNode(mode);
        process.exit(0);
        break;
      case "build:browser":
        await buildBrowser(mode, fast);
        process.exit(0);
        break;
      default:
        throw new Error("Unknown command");
    }
  } catch (err) {
    if (err) {
      console.error(err.message);
      console.error(err.stack);
    } else {
      console.error();
    }
    process.exit(1);
  }
})(process.env.npm_lifecycle_event);
