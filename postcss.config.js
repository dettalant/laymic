const cssnano = require("cssnano");
const postcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");

const isProduction = process.env.NODE_ENV === "production";

const postcssPresetEnvArgs = {
  stage: 2,
  features: {
    "nesting-rules": true
  },
  autoprefixer: {
    cascade: false,
  }
}

const cssnanoArgs = {
  preset: "default",
};

module.exports = {
  plugins: [
    postcssImport(),
    postcssPresetEnv(postcssPresetEnvArgs),
    isProduction && cssnano(cssnanoArgs),
  ]
};
