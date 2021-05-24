const { join } = require("path");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { gzip: zopfliGzip } = require("@gfx/zopfli");
const lzma = require("lzma-native");
const { brotliCompress } = require("zlib");

let compressPromise = Promise.resolve();

const gzipContent = (buf, _, callback) => {
  compressPromise = compressPromise.then(
    () =>
      new Promise((resolve) => {
        zopfliGzip(
          buf,
          {
            numiterations: 15,
          },
          (...info) => {
            resolve();
            callback(...info);
          }
        );
      })
  );
};

const xzContent = (buf, _, callback) => {
  compressPromise = compressPromise.then(
    () =>
      new Promise((resolve) => {
        lzma
          .compress(buf, {
            preset: 8,
          })
          .then(
            (data) => {
              resolve();
              callback(null, data);
            },
            (err) => {
              resolve();
              callback(err);
            }
          );
      })
  );
};

const brContent = (buf, _, callback) => {
  compressPromise = compressPromise.then(
    () =>
      new Promise((resolve) => {
        brotliCompress(
          buf,
          {
            mode: 0,
            quality: 11,
            lgwin: 22,
            lgblock: 0,
            enable_dictionary: true,
            enable_transforms: false,
            greedy_block_split: false,
            enable_context_modeling: false,
          },
          (...info) => {
            resolve();
            callback(...info);
          }
        );
      })
  );
};

module.exports = (
  mode = "production",
  isLegacy = false,
  app = "admin",
  fast = false
) => {
  const env = {
    NODE_ENV: JSON.stringify(mode),
    "process.env.NODE_ENV": JSON.stringify(mode),
  };

  const plugins = [
    new WebpackManifestPlugin({
      fileName: `${app}.manifest.${isLegacy ? "legacy" : "modern"}.json`,
      filter: (chunk) => chunk.name.endsWith(".js"),
    }),
    new DefinePlugin(env),
  ];

  if (!isLegacy && app === "admin") {
    plugins.push(
      new CopyWebpackPlugin({
        patterns: [join(__dirname, "../src/static")],
      }),
      new WebpackManifestPlugin({
        seed: {},
        fileName: "static.manifest.json",
        filter: (chunk) => !chunk.name.endsWith(".js"),
        generate: (seed, files) => {
          return files.reduce((out, file) => {
            out[file.name] = file.path;
            return out;
          }, seed);
        },
      })
    );
  }

  if (mode === "production" && !fast) {
    plugins.push(
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: gzipContent,
        include: /\.(js|css|svg|json|xml|eot|ttf)$/,
        exclude: /manifest/,
        threshold: 1000,
        minRatio: 0.8,
      }),
      new CompressionPlugin({
        filename: "[path][base].xz",
        algorithm: xzContent,
        include: /\.(js|css|svg|json|xml|eot|ttf)$/,
        exclude: /manifest/,
        threshold: 0,
        minRatio: 0.8,
      }),
      new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: brContent,
        include: /\.(js|css|svg|json|xml|eot|ttf)$/,
        exclude: /manifest/,
        threshold: 0,
        minRatio: 0.8,
      })
    );
  }

  const entry = [join(__dirname, "../src", app, "browser.ts")];

  const rules = [];

  const configFile = join(__dirname, "./tsconfig.web.json");

  const tsOptions = {
    configFile,
    transpileOnly: fast || mode === "production",
  };

  let target = ["web"];

  if (isLegacy) {
    target = ["web", "es5"];
    entry.unshift("core-js/stable", "regenerator-runtime/runtime");
    const babelOptions = {
      cacheDirectory: true,
      babelrc: false,
      plugins: ["@babel/plugin-syntax-dynamic-import"],
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              ie: "11",
            },
          },
        ],
      ],
    };

    rules.push({
      test: /\.tsx?$/,
      resolve: {
        mainFields: ["browser", "main", "module"],
      },
      use: [
        {
          loader: "babel-loader",
          options: babelOptions,
        },
        {
          loader: "ts-loader",
          options: tsOptions,
        },
      ],
    });
    rules.push({
      test: /\/node_modules\/@webcarrot\/(api|parse|router|router-match).*\.m?js$/,
      resolve: {
        mainFields: ["browser", "main", "module"],
      },
      use: [
        {
          loader: "babel-loader",
          options: babelOptions,
        },
      ],
    });
  } else {
    rules.push({
      test: /\.tsx?$/,
      resolve: {
        mainFields: ["browser", "module", "main"],
      },
      use: [
        {
          loader: "ts-loader",
          options: tsOptions,
        },
      ],
    });
  }

  if (mode === "development") {
    rules.push({
      enforce: "pre",
      test: /\.js$/,
      loader: "source-map-loader",
    });
  }

  return {
    target,
    entry,
    output: {
      filename: `${isLegacy ? "legacy" : "modern"}/${app}/${
        mode === "development" ? "[name]/[chunkhash]" : "[chunkhash]"
      }.js`,
      pathinfo: false,
      path: join(__dirname, "../dist", mode, "build"),
      publicPath: "/",
    },
    watch: mode === "development",
    watchOptions: {
      aggregateTimeout: 5000,
      ignored: ["dist/**/*", "node_modules/**/*"],
    },
    mode: mode,
    devtool: mode === "development" ? "eval-source-map" : undefined,
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile,
        }),
      ],
    },
    plugins,
    module: {
      rules,
    },
    stats: {
      colors: false,
      chunks: false,
    },
    optimization: {
      nodeEnv: mode,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: "vendors",
          },
          material: {
            test: /[\\/]@material-ui[\\/]/,
            priority: -9,
            name: "material",
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };
};
