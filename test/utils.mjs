import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export const readMockFile = (filename) =>
  fs.readFileSync(`${__dirname}/mock/${filename}`, "utf8");
