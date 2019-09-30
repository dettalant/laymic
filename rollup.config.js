import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

const isProduction = process.env.NODE_ENV === "production";

const bannerComment = `/*!
 *   ${pkg.name}.js
 *
 * @author dettalant
 * @version v${pkg.version}
 * @license ${pkg.license} License
 */`;

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    useTsconfigDeclarationDir: true
  }),
];

if (isProduction) {
  // for production build
//   const terserOptions = {
//     output: {
//       comments: "some"
//     }
//   }
//
//   plugins.push(terser(terserOptions));
}

const dirName = "./dist/";
const cjsOutput = {
  dir: dirName,
  entryFileNames: "[name].js",
  format: "cjs",
  name: pkg.name,
  banner: bannerComment,
  sourceMap: "inline",
}

const iifeOutput = Object.assign({}, cjsOutput);
iifeOutput.format = "iife";
iifeOutput.entryFileNames = "[name]_iife.js";

export default {
  input: "./src/index.ts",
  output: [
    cjsOutput,
    iifeOutput,
  ],
  plugins
};
