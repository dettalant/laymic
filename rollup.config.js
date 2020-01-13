import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const isProduction = process.env.NODE_ENV === "production";

// dealing with scoped package name
const pkgName = pkg.name.split("/").pop();

const bannerComment = `/*!
 *   ${pkgName}.js
 *
 * Reference: [swiper](https://github.com/nolimits4web/swiper)
 *
 * @author dettalant
 * @version v${pkg.version}
 * @license ${pkg.license} License
 *
 */`;

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: "tsconfig-build.json",
    useTsconfigDeclarationDir: true
  }),
];

const buildName = ["laymic", ".js"];

if (isProduction) {
  // for production build
  const terserOptions = {
    output: {
      comments: "some"
    }
  }

  plugins.push(terser(terserOptions));
  buildName.splice(1, 0, ".min");
}

const dirName = "./dist/";
const cjsOutput = {
  dir: dirName,
  entryFileNames: buildName.join(""),
  format: "cjs",
  name: pkgName,
  banner: bannerComment,
  sourceMap: "inline",
}

buildName.splice(1, 0, ".iife");
const iifeOutput = Object.assign({}, cjsOutput);
iifeOutput.format = "iife";
iifeOutput.entryFileNames = buildName.join("");

export default {
  input: "./src/index.ts",
  output: [
    cjsOutput,
    iifeOutput,
  ],
  plugins
};
