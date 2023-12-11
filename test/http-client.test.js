import qs from "querystring";
import fetch from "node-fetch";
import entsoe, { BiddingZonesByCountry } from "../src/index";
import { readMockFile } from "./utils";

jest.mock("node-fetch");

const biddingZone = BiddingZonesByCountry.SE4; // Sweden zone 4
const apiToken = "toker";
const startDate = "2023-08-07T00:00:00.000Z";
const endDate = "2023-08-08T00:00:00.000Z";

describe("API client", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should handle 401 status and return unauthRT error message", async () => {
    const client = entsoe({ apiToken });
    const rawResponse = readMockFile("unauth-resp.xml");
    const mockResponse = {
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue(rawResponse),
    };
    fetch.mockResolvedValue(mockResponse);

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
    const rawResponse = readMockFile("bad-request-resp.xml");
    const mockResponse = {
      ok: false,
      status: 400,
      text: jest.fn().mockResolvedValue(rawResponse),
    };
    fetch.mockResolvedValue(mockResponse);

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
    const mockResponse = {
      ok: false,
      status: 400,
      text: jest.fn().mockResolvedValue("<? "),
    };
    fetch.mockResolvedValue(mockResponse);

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
    const rawResponse = readMockFile("day-ahead-prices-resp.xml");
    const mockResponse = {
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(rawResponse),
      headers: {
        get: jest.fn(() => "application/xml"),
      },
    };
    fetch.mockResolvedValue(mockResponse);

    const requests = Array.from({ length: 401 }).map(
      () => () =>
        client.dayAheadPrices({ startDate: "2023-08-26", biddingZone }),
    );

    await Promise.all(
      requests.map((promise, index) => {
        return promise()
          .then(() => {
            if (index <= 400) {
              expect(fetch).toHaveBeenLastCalledWith(
                expect.any(String),
                expect.objectContaining({
                  headers: expect.anything(),
                }),
              );
            } else {
              expect(fetch).not.toHaveBeenLastCalledWith(
                expect.any(String),
                expect.objectContaining({
                  headers: expect.anything(),
                }),
              );
            }
          })
          .catch((error) => {
            if (index <= 400) {
              expect(error.message).toBe("Request throttled");
            } else {
              expect(error.message).not.toBe("Request throttled");
            }
          });
      }),
    );
  });

  test("should reset throttle after one minute", async () => {
    const client = entsoe({ apiToken });
    const originalDateNow = Date.now;
    const now = Date.now();
    Date.now = jest.fn(() => now);
    const rawResponse = readMockFile("day-ahead-prices-resp.xml");
    const mockResponse = {
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(rawResponse),
      headers: {
        get: jest.fn(() => "application/xml"),
      },
    };
    fetch.mockResolvedValue(mockResponse);

    // Make 400 requests
    await Promise.all(
      Array.from({ length: 400 }).map(() =>
        client.dayAheadPrices({ startDate: "2023-08-26", biddingZone }),
      ),
    );

    // Make a request after 60 seconds
    Date.now = jest.fn(() => now + 60 * 1000 + 1);
    await client.dayAheadPrices({
      startDate: "2023-08-26",
      biddingZone,
    });

    expect(fetch).toHaveBeenCalledTimes(401); // Initial 400 + 1 after reset

    Date.now = originalDateNow; // Restore Date.now to original implementation
  });

  test("dayAheadPrices should make a successful request and return transformed data", async () => {
    const client = entsoe({ apiToken });
    const url = `https://web-api.tp.entsoe.eu/api?in_Domain=${biddingZone}&out_Domain=${biddingZone}&timeInterval=${qs.escape(
      `${startDate}/${endDate}`,
    )}&documentType=A44&securityToken=${apiToken}`;

    const expectedResponse = JSON.parse(
      readMockFile("day-ahead-prices-transf.json"),
    );
    const rawResponse = readMockFile("day-ahead-prices-resp.xml");
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(rawResponse),
      headers: {
        get: jest.fn(() => "application/xml"),
      },
    };
    fetch.mockResolvedValue(mockResponse);

    const transformedData = await client.dayAheadPrices({
      startDate,
      endDate,
      biddingZone,
    });

    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: "GET",
        headers: { "Content-Type": "application/xml" },
        body: undefined,
      }),
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
