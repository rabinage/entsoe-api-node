import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { readMockFile } from "./utils.mjs";
import {
  mockAgent,
  baseInterceptor,
  apiToken,
  biddingZone,
  endDate,
  startDate,
} from "./api-mock.mjs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const entsoe = require("../dist/index.js").default;

describe("API client", () => {
  test("should handle 401 status and return unauthRT error message", async () => {
    const client = entsoe({ apiToken });
    baseInterceptor.reply(401, readMockFile("unauth-resp.xml"));

    await assert.rejects(
      client.dayAheadPrices({
        startDate,
        endDate,
        biddingZone,
      }),
      new Error("Unauthorized. Missing or invalid security token"),
    );
  });

  test("should handle 400 status and return badRequestRT error message", async () => {
    const client = entsoe({ apiToken });
    baseInterceptor.reply(400, readMockFile("bad-request-resp.xml"));

    await assert.rejects(
      client.dayAheadPrices({
        startDate,
        endDate,
        biddingZone,
      }),
      new Error("Bad request message from API"),
    );
  });

  test("should handle other errors as unexpected errors", async () => {
    const client = entsoe({ apiToken });
    baseInterceptor.reply(400, "<? ");

    await assert.rejects(
      client.dayAheadPrices({
        startDate,
        endDate,
        biddingZone,
      }),
      "/Unexpected error:/",
    );
  });

  test("should throttle after 400 requests", async () => {
    const client = entsoe({ apiToken });
    baseInterceptor
      .reply(200, readMockFile("day-ahead-prices-resp.xml"))
      .times(401);

    const requests = Array.from({ length: 401 }).map(
      () => () => client.dayAheadPrices({ startDate, endDate, biddingZone }),
    );

    const results = await Promise.allSettled(
      requests.map((promise) => promise()),
    );

    results.slice(0, 400).forEach((result, index) => {
      if (result.status !== "fulfilled") {
        assert.fail(
          `Request ${index} failed with error: ${result.reason.message}`,
        );
      }
    });

    const lastRequestResult = results[400];
    assert.strictEqual(
      lastRequestResult.status,
      "rejected",
      "Last request should be throttled",
    );
    assert.strictEqual(lastRequestResult.reason.message, "Request throttled");
  });

  test("should reset throttle after one minute", async () => {
    const client = entsoe({ apiToken });
    const originalDateNow = Date.now;
    const now = Date.now();
    Date.now = () => now;
    baseInterceptor
      .reply(200, readMockFile("day-ahead-prices-resp.xml"))
      .times(401);

    // Make 400 requests
    await Promise.all(
      Array.from({ length: 400 }).map(() =>
        client.dayAheadPrices({ startDate, biddingZone }),
      ),
    );

    // Make a request after 60 seconds
    Date.now = () => now + 60 * 1000 + 1;
    await assert.doesNotReject(
      client.dayAheadPrices({
        startDate,
        biddingZone,
      }),
    );

    Date.now = originalDateNow; // Restore Date.now
  });
});

describe("dayAheadPrices", () => {
  before(() => {
    baseInterceptor
      .reply(200, readMockFile("day-ahead-prices-resp.xml"))
      .persist();
  });

  after(() => {
    mockAgent.close();
  });

  test("should make a successful request and return transformed data", async () => {
    const client = entsoe({ apiToken });
    const result = await client.dayAheadPrices({
      startDate,
      endDate,
      biddingZone,
    });
    const expectedResult = JSON.parse(
      readMockFile("day-ahead-prices-transf.json"),
    );
    assert.deepStrictEqual(result, expectedResult);
  });

  test("should throw an error when 'startDate' is missing", async () => {
    const client = entsoe({ apiToken });
    await assert.rejects(
      client.dayAheadPrices({
        endDate,
        biddingZone,
      }),
      new Error("'startDate' is required"),
    );
  });

  test("should throw an error when 'biddingZone' is missing", async () => {
    const client = entsoe({ apiToken });
    await assert.rejects(
      client.dayAheadPrices({
        startDate,
        endDate,
      }),
      new Error("'biddingZone' is required"),
    );
  });
});
