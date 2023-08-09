import qs from "querystring";
import fetch from "node-fetch";

import entsoe, { BiddingZones } from "../src/index";
import { readMockFile } from "./utils";

const biddingZone = BiddingZones.SW4; // Sweden zone 4
const apiToken = "toker";
const startDate = "2023-08-07T00:00:00.000Z";
const endDate = "2023-08-08T00:00:00.000Z";

const client = entsoe({ apiToken });

jest.mock("node-fetch");

describe("API client Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("API client should handle 401 status and return unauthRT error message", async () => {
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

  test("API client should handle 400 status and return badRequestRT error message", async () => {
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

  test("API client should all other errors as unexpected errors", async () => {
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

  test("dayAheadPrices should make a successful request and return transformed data", async () => {
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
    await expect(
      client.dayAheadPrices({
        endDate,
        biddingZone,
      }),
    ).rejects.toThrow("'startDate' is required");
  });

  test("dayAheadPrices should throw an error when 'biddingZone' is missing", async () => {
    await expect(
      client.dayAheadPrices({
        startDate,
        endDate,
      }),
    ).rejects.toThrow("'biddingZone' is required");
  });
});
