import fs from "fs:node";

export const readMockFile = (filename) =>
  fs.readFileSync(`${__dirname}/mock/${filename}`, "utf8");
