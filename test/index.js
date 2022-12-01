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

test("[REST] dayAheadPrices using default start date", async () => {
  const localDate = new Date(new Date().setHours(0, 0, 0, 0));

  const res = await client.dayAheadPrices({ biddingZone });

  expect(res.period.timeInterval.start).toBe(
    new Date(localDate).toISOString().replace(/:00.000Z/, "Z")
  );
  expect(res.period.timeInterval.end).toBe(
    new Date(localDate.setHours(48)).toISOString().replace(/:00.000Z/, "Z")
  );
  expect(res.timeSeries.length).toBe(2);
  expect(res.timeSeries[0].period.point.length).toBe(24);
});

test("[REST] dayAheadPrices with start date", async () => {
  const localeDateString = "2022-08-11T22:01:02.003Z";

  const res = await client.dayAheadPrices({
    biddingZone,
    startDate: localeDateString,
  });

  expect(res.period.timeInterval.start).toBe("2022-08-11T22:00Z");
  expect(res.period.timeInterval.end).toBe("2022-08-12T22:00Z");
  expect(res.timeSeries.length).toBe(1);
});

test("[REST] dayAheadPrices with another start date", async () => {
  const dateString = "2022-08-11T21:01:02.003Z";

  const res = await client.dayAheadPrices({
    biddingZone,
    startDate: dateString,
  });

  expect(res.period.timeInterval.start).toBe("2022-08-10T22:00Z");
  expect(res.period.timeInterval.end).toBe("2022-08-12T22:00Z");
  expect(res.timeSeries.length).toBe(2);
});

test("[REST] dayAheadPrices with start and end date", async () => {
  const startDate = "2022-08-11T21:01:01.001Z";
  const endDate = "2022-08-14T23:01:01.001Z";

  const res = await client.dayAheadPrices({
    biddingZone,
    startDate,
    endDate,
  });

  expect(res.period.timeInterval.start).toBe("2022-08-10T22:00Z");
  expect(res.period.timeInterval.end).toBe("2022-08-15T22:00Z");
  expect(res.timeSeries.length).toBe(5);
});
