const { execSync } = require("child_process");
const {
  buildNode,
  buildBrowser,
  buildPack,
  publishPack,
  packPack
} = require("./build");
const { clear } = require("./clear");
Error.stackTraceLimit = 100;

(async () => {
  const mode = "production";
  const production = process.argv.includes("--production");
  const beta = !production && process.argv.includes("--beta");
  const alpha = (!production && !beta) || process.argv.includes("--alpha");
  const test = process.argv.includes("--test");
  const pack = process.argv.includes("--pack");

  const tagIndex = process.argv.indexOf("--tag");
  let tag =
    (beta || alpha) &&
    tagIndex > 0 &&
    process.argv[tagIndex] &&
    /^[a-z0-9]$/.test(process.argv[tagIndex])
      ? process.argv[tagIndex]
      : "";

  if (!tag && (beta || alpha)) {
    tag = execSync("git branch --show-current")
      .toString()
      .trim()
      .replace(/[^a-z0-9]/g, "-");
  }

  if (execSync("git status --porcelain=v1").toString().trim()) {
    throw new Error("Uncommitted changes detected");
  }

  console.log("clear");
  await clear(mode);
  console.log("build:node");
  await buildNode(mode);
  console.log("build:browser");
  await buildBrowser(mode, false);
  console.log("build:pack");
  const version = await buildPack(mode, alpha, beta, tag);
  console.log(`Version ${version}`);
  if (pack) {
    console.log("pack:pack");
    await packPack(mode, alpha, beta, test);
  } else {
    console.log("publish:pack");
    await publishPack(mode, alpha, beta, test);
  }
})().catch(err => {
  console.error(err.message);
  process.exit(1);
});
