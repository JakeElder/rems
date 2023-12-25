import type { Config } from "jest";

const config: Config = {
  setupFiles: ["<rootDir>/.jest/set-env-vars.ts"]
};

export default config;
