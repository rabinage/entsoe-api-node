import Entsoe, { BiddingZones } from "../src/index";

/**
 * Print the current day and night price.
 */

const formatHour = (hourString) =>
  (hourString.length === 1 ? "0" : "") + hourString;

const client = Entsoe({ apiToken: process.env.API_TOKEN });

client
  .dayAheadPrices({
    biddingZone: BiddingZones.SW4,
  })
  .then((res) => {
    res.timeSeries.forEach((ts) => {
      const date = new Date(ts.period.timeInterval.start).toLocaleDateString();

      // eslint-disable-next-line no-console
      console.table(
        ts.period.point.map((p) => {
          const hour = `${formatHour(
            (parseInt(p.position, 10) - 1).toString()
          )}-${formatHour(p.position === "24" ? "0" : p.position)}`;

          return {
            [date]: hour,
            "EUR/MWh": parseFloat(p.priceAmount, 10).toFixed(2),
          };
        })
      );
    });
  });
