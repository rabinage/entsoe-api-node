import fetch from "node-fetch";

import { dayAheadPriceRT, badRequestRT, unauthRT } from "./transformers";
import { DocumentTypes, BASE_URL, TESTNET_URL } from "./const";

const makeQueryString = (query) =>
  query
    ? `?${Object.keys(query)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`,
        )
        .join("&")}`
    : "";

const responseHandler = async (req, transformResponse) => {
  const resp = await req;

  if (resp.ok) {
    return transformResponse(await resp.text());
  }

  let error;
  try {
    const errorBody = await resp.text();

    error = new Error();
    if (resp.status === 401) {
      error.message = await unauthRT(errorBody);
    } else {
      const json = await badRequestRT(errorBody);
      error.message = json.message;
      error.code = json.code;
    }
  } catch (err) {
    error = new Error(`Unexpected error: ${err}`);
  }
  throw error;
};

const request =
  ({ endpoint, apiToken }) =>
  ({
    params = {},
    data,
    method = "GET",
    headers = {
      "Content-Type": "application/xml",
    },
    transformResponse,
  } = {}) => {
    return responseHandler(
      fetch(
        `${endpoint}${makeQueryString({
          ...params,
          securityToken: apiToken,
        })}`,
        {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
        },
      ),
      transformResponse,
    );
  };

const dayAheadPrices = (
  req,
  payload = {},
  transformResponse = dayAheadPriceRT,
) =>
  new Promise((resolve, reject) => {
    const { startDate, endDate, biddingZone } = payload;

    try {
      if (!startDate) {
        throw new Error("'startDate' is required");
      }

      if (!biddingZone) {
        throw new Error("'biddingZone' is required");
      }

      const sd = new Date(new Date(startDate).setMinutes(0, 0, 0));
      const ed = endDate
        ? new Date(new Date(endDate).setMinutes(0, 0, 0))
        : new Date(new Date(sd).setHours(sd.getHours() + 24));
      const timeInterval = `${sd.toISOString()}/${ed.toISOString()}`;

      resolve(
        req({
          params: {
            in_Domain: biddingZone,
            out_Domain: biddingZone,
            timeInterval,
            documentType: DocumentTypes.PRICE_DOCUMENT,
          },
          transformResponse,
        }),
      );
    } catch (err) {
      reject(err);
    }
  });

export default (opts) => {
  const req = request({
    endpoint: opts.testnet ? TESTNET_URL : BASE_URL,
    apiToken: opts.apiToken,
  });

  return {
    dayAheadPrices: (payload, transformResponse) =>
      dayAheadPrices(req, payload, transformResponse),
  };
};
