const { rmdirSync, readdirSync, statSync, unlinkSync } = require("fs");
const { join } = require("path");

const remove = path => {
  let info;
  try {
    info = statSync(path);
  } catch (_) {
    return;
  }
  if (info.isDirectory()) {
    readdirSync(path).forEach(p => remove(join(path, p)));
    rmdirSync(path);
  } else {
    unlinkSync(path);
  }
};

module.exports = {
  clear(mode = "production") {
    remove(join(__dirname, "../dist/", mode));
  }
};
