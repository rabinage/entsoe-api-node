import entsoe from "../src/index";
import { readMockFile } from "./utils";
import {
  mockAgent,
  baseInterceptor,
  apiToken,
  biddingZone,
  endDate,
  startDate,
} from "./api-mock";

describe("API client", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should handle 401 status and return unauthRT error message", async () => {
    const client = entsoe({ apiToken });
    baseInterceptor.reply(401, readMockFile("unauth-resp.xml"));

    await expect(
      client.dayAheadPrices({
        startDate,
        endDate,
        biddingZone,
      }),
    ).rejects.toThrow("Unauthorized. Missing or invalid security token");
  });

  test("should handle 400 status and return badRequestRT error message", async () => {
    const client = entsoe({ apiToken });
    baseInterceptor.reply(400, readMockFile("bad-request-resp.xml"));

    await expect(
      client.dayAheadPrices({
        startDate,
        endDate,
        biddingZone,
      }),
    ).rejects.toThrow("Bad request message from API");
  });

  test("should all other errors as unexpected errors", async () => {
    const client = entsoe({ apiToken });
    baseInterceptor.reply(400, "<? ");

    await expect(
      client.dayAheadPrices({
        startDate,
        endDate,
        biddingZone,
      }),
    ).rejects.toThrow("Unexpected error:");
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

    const lastRequestResult = results[400];

    expect(lastRequestResult.reason.message).toBe("Request throttled");
  });

  test("should reset throttle after one minute", async () => {
    const client = entsoe({ apiToken });
    const originalDateNow = Date.now;
    const now = Date.now();
    Date.now = jest.fn(() => now);
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
    Date.now = jest.fn(() => now + 60 * 1000 + 1);
    await client.dayAheadPrices({
      startDate,
      biddingZone,
    });

    Date.now = originalDateNow; // Restore Date.now to original implementation
  });
});

describe("dayAheadPrices", () => {
  beforeAll(() => {
    baseInterceptor
      .reply(200, readMockFile("day-ahead-prices-resp.xml"))
      .persist();
  });

  afterAll(() => {
    mockAgent.close();
  });

  test("should make a successful request and return transformed data", async () => {
    const client = entsoe({ apiToken });
    const transformedData = await client.dayAheadPrices({
      startDate,
      endDate,
      biddingZone,
    });
    const expectedResponse = JSON.parse(
      readMockFile("day-ahead-prices-transf.json"),
    );

    expect(transformedData).toEqual(expectedResponse);
  });

  test("dayAheadPrices should throw an error when 'startDate' is missing", async () => {
    const client = entsoe({ apiToken });
    await expect(
      client.dayAheadPrices({
        endDate,
        biddingZone,
      }),
    ).rejects.toThrow("'startDate' is required");
  });

  test("dayAheadPrices should throw an error when 'biddingZone' is missing", async () => {
    const client = entsoe({ apiToken });
    await expect(
      client.dayAheadPrices({
        startDate,
        endDate,
      }),
    ).rejects.toThrow("'biddingZone' is required");
  });
});
