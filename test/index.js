import entsoe, { BiddingZones } from "../src/index";

const biddingZone = BiddingZones.SW4; // Sweden zone 4

const client = entsoe({ apiToken: process.env.API_TOKEN });

test("dayAheadPrices with no parameters", async () => {
  try {
    await client.dayAheadPrices();
  } catch (err) {
    expect(err.message).toBe("'biddingZone' is required");
  }
});

test("[REST] Error on no API token", async () => {
  expect.assertions(1);

  try {
    await entsoe({ apiToken: "" }).dayAheadPrices({ biddingZone });
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
  }
});

test("[REST] dayAheadPrices with start and end date", async () => {
  const startDate = "2022-08-11T01:00:01.001Z";
  const endDate = "2022-08-15T22:00:00.000Z";

  const res = await client.dayAheadPrices({
    biddingZone,
    startDate,
    endDate,
  });

  expect(res.period.timeInterval.start).toBe("2022-08-10T22:00Z");
  expect(res.period.timeInterval.end).toBe(endDate.replace(/:00.000Z/, "Z"));
});
