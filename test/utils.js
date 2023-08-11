/* eslint-disable import/prefer-default-export */
import fs from "fs";

export const readMockFile = (filename) =>
  fs.readFileSync(`${__dirname}/mock/${filename}`, "utf8");
