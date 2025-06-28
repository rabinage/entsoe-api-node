import { parseStringPromise } from "xml2js";
import Entsoe, { BiddingZonesByCountry } from "../src/index.js";

/**
 * Example using a custom response transformer.
 */

const client = Entsoe({ apiToken: process.env.API_TOKEN });

const customRt = async (xmlString) => {
  const json = parseStringPromise(xmlString);

  /* Do some magic to the response */

  return json;
};
client
  .dayAheadPrices(
    {
      biddingZone: BiddingZonesByCountry.SE4,
      startDate: new Date().toISOString(),
    },
    customRt,
  )
  .then((res) => console.log(res));
