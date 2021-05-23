const { fork, execSync } = require("child_process");
const { join } = require("path");
const {
  statSync,
  readFileSync,
  writeFileSync,
  createWriteStream,
  unlinkSync,
} = require("fs");
const archiver = require("archiver");

const webpackBuild = (mode, fast, cb) => {
  const webpack = require("webpack");
  const makeWebpackConfig = require("../build/webpack");
  const onDone = (err, stats) => {
    cb(
      err,
      !err && mode === "development"
        ? `[${new Date().toLocaleTimeString()}] info: ${mode} build done`
        : stats
        ? stats.toString()
        : "No stats"
    );
  };
  const configurations = [makeWebpackConfig(mode, false, "admin", fast)];
  if (!fast && mode === "production") {
    configurations.push(makeWebpackConfig(mode, true, "admin", fast));
  }
  webpack(configurations, onDone);
};

module.exports = {
  buildNode(mode = "production") {
    return new Promise((resolve, reject) => {
      let resolved = false;
      const onSuccess = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      const onError = (err) => {
        if (!resolved) {
          resolved = true;
          reject(err);
        }
      };
      if (mode === "development") {
        const child = fork(
          join(__dirname, "../node_modules/typescript/bin/tsc"),
          ["-b", `./build/tsconfig.${mode}.json`, "--watch"],
          {
            cwd: join(__dirname, "../"),
          }
        );
        child.once("exit", (code, signal) =>
          code ? onError(signal) : onSuccess()
        );
        child.once("error", onError);
        const check = () => {
          try {
            const info = statSync(
              join(__dirname, "../dist", mode, "node-server.js")
            );
            if (info.isFile()) {
              onSuccess();
            }
          } catch (_) {
            !resolved && setTimeout(check, 100);
          }
        };
        setTimeout(check, 100);
      } else {
        const child = fork(
          join(__dirname, "../node_modules/typescript/bin/tsc"),
          ["-b", `./build/tsconfig.${mode}.json`],
          {
            cwd: join(__dirname, "../"),
          }
        );
        child.once("exit", (code, signal) =>
          code ? onError(signal) : onSuccess()
        );
        child.once("error", onError);
      }
    });
  },
  buildBrowser(mode = "production", fast = false) {
    return new Promise((resolve, reject) => {
      let resolved = false;
      webpackBuild(mode, fast, (err, stats) => {
        if (stats) {
          console.info(stats);
        }
        if (!resolved) {
          resolved = true;
          err ? reject(new Error(err)) : resolve();
        } else if (err) {
          console.error(err);
        }
      });
    });
  },
  buildPackage(mode = "production") {
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, "../package.json"))
    );
    packageJson.devDependencies = {};

    packageJson.scripts = Object.keys(packageJson.scripts).reduce(
      (out, key) => {
        if (/^(setup|start-)/.test(key)) {
          out[key] = packageJson.scripts[key].replace(`/dist/${mode}`, "");
        }
        return out;
      },
      {}
    );

    writeFileSync(
      join(__dirname, `../dist/${mode}/package.json`),
      JSON.stringify(packageJson, null, 2)
    );

    const archive = archiver("zip", { zlib: { level: 0 } });
    const stream = createWriteStream(join(__dirname, `../package-${mode}.zip`));

    return new Promise((resolve, reject) => {
      archive
        .directory(join(__dirname, `../dist/${mode}`), false)
        .on("error", (err) => reject(err))
        .pipe(stream);

      stream.on("close", () => resolve());
      archive.finalize();
    });
  },
  buildPack(mode = "production", alpha = true, beta = false, tag = "") {
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, "../package.json"))
    );
    packageJson.devDependencies = {};

    packageJson.scripts = {};
    packageJson.private = false;
    packageJson.bin = {
      "webcarrot-multi-lan-controller": "./multi-lan-controller.run",
      "webcarrot-multi-lan-controller-service":
        "./multi-lan-controller-service.run",
    };

    writeFileSync(
      join(__dirname, `../dist/${mode}/package.json`),
      JSON.stringify(packageJson, null, 2)
    );

    writeFileSync(
      join(__dirname, `../dist/${mode}/multi-lan-controller.run`),
      '#!/usr/bin/env node\nrequire("./node-server");'
    );

    writeFileSync(
      join(__dirname, `../dist/${mode}/multi-lan-controller-service.run`),
      `
try {
  require.resolve("node-windows");
} catch (_) {
  execSync("npm install -g node-windows");
  execSync("npm link node-windows");
}
const script = require.resolve("./node-server");
const { Service } = require('node-windows');

const svc = new Service({
  name: "LAN Controllers",
  description: "LAN Controllers Manager",
  script,
  scriptOptions: process.argv.slice(2).join(" ")
});

svc.on("install",() => {
  svc.start();
});

svc.install();
`
    );

    writeFileSync(
      join(__dirname, `../dist/${mode}/README.md`),
      readFileSync(join(__dirname, "../README.md"))
    );

    execSync(`npm install --prefix ${join(__dirname, `../dist/${mode}`)}`);

    return packageJson.version;
  },
  publishPack(mode = "production", alpha = true, beta = false, test = false) {
    const tag = alpha ? "alpha" : beta ? "beta" : "latest";
    execSync(
      `npm publish ${join(
        __dirname,
        `../dist/${mode}`
      )} --tag ${tag} --access public ${test ? "--dry-run" : ""}`
    );
  },
  packPack(mode = "production", alpha = true, beta = false, test = false) {
    const tag = alpha ? "alpha" : beta ? "beta" : "latest";
    execSync(
      `npm pack ${join(__dirname, `../dist/${mode}`)} --tag ${tag} ${
        test ? "--dry-run" : ""
      }`
    );
  },
};
