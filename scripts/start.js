const { join } = require("path");

module.exports = {
  startNode(mode = "production") {
    const ROOT_PATH = join(__dirname, "..");
    process.env.ROOT_PATH = ROOT_PATH;
    if (mode === "development") {
      require("nodemon")({
        cwd: join(__dirname, "../"),
        script: `dist/${mode}/node-server.js`,
        ignore: [`dist/${mode}/build/`, "node_modules/"],
        watch: [`dist/${mode}/`],
        args: [...process.argv.slice(2)],
        execMap: {
          js: "node --preserve-symlinks",
        },
        env: {
          ...process.env,
        },
        delay: 2,
      })
        .on("exit", (code) => {
          if (code !== "SIGUSR2") {
            process.exit(0);
          } else {
            console.log(`[${new Date().toLocaleTimeString()}] nodemon restart`);
          }
        })
        .on("crash", (code) => {
          process.exit(code);
        });
    } else {
      require(`../dist/${mode}/node-server.js`);
    }
  },
};
