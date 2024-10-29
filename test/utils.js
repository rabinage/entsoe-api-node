import fs from "node:fs";

export const readMockFile = (filename) =>
  fs.readFileSync(`${__dirname}/mock/${filename}`, "utf8");
