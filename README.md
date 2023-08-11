# entsoe-api-node [![Build](https://github.com/rabinage/entsoe-api-node/actions/workflows/ci.yaml/badge.svg)](https://github.com/rabinage/entsoe-api-node/actions/workflows/ci.yaml)

> Unofficial API wrapper for the [ENTSO-E Transparency Platform](https://transparency.entsoe.eu) RESTful API.

### Why this wrapper

The API responses from the [ENTSO-E Transparency Platform](https://transparency.entsoe.eu) are formatted in XML, which may not be easily consumable in JavaScript applications. This wrapper transforms the response into the more compatible JSON format.

- [ENTSO-E Transparency Platform](https://transparency.entsoe.eu/dashboard/show)
- [Transparency Platform API spec.](https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html)

### Table of Contents

- [Installation](#installation)
- [Getting started](#getting-started)
  - [Initialize](#initialize)
  - [Code examples](#code-examples)
- [Public REST Endpoints](#public-rest-endpoints)
  - [dayAheadPrices](#day-ahead-prices)
- [Miscellaneous](#miscellaneous)
  - [Bidding zones](#bidding-zones)

### Installation

    npm i entsoe-api-node

### Getting started

To use this wrapper, you must first register with the Transparency Platform and request access to the RESTful API by sending an email to transparency@entsoe.eu with 'Restful API access' in the subject line. Be sure to include the email address you used during registration in the email body. Once granted access, you can then generate a security token under the account settings.

```js
import Entsoe, { BiddingZonesByCountry } from "entsoe-api-node";

const client = Entsoe({ apiToken: "YOUR-SECURITY-TOKEN" });

const result = await client.dayAheadPrices({
  startDate: new Date().toISOString(),
  biddingZone: BiddingZonesByCountry.SE4,
});
```

Require using commonjs.

```js
const Enstoe = require("entsoe-api-node").default;
```

#### Initialize

| Param    | Type    | Required | Info                     |
| -------- | ------- | -------- | ------------------------ |
| apiToken | String  | true     |                          |
| testnet  | Boolean | false    | For testing purpose only |

#### Code examples

The `/example` folder contains code examples on how to use the API methods. You can try out these examples by running the following command:

    npm run example:dev -- example/example-file.js

### Public REST Endpoints

Time is always expressed in UTC.

Each method accepts an optional second parameter to customize the XML response.

```js
console.log(await client.dayAheadPrices({ biddingZone: "10Y1001A1001A47J" }, (xmlString) async => /* parse the XML and return some magic */));
```

#### dayAheadPrices

Get the published day-ahead prices for given bidding zone. The result always includes 24 hours of data, starting from midnight local time of the specified bidding zone.

```js
console.log(
  await client.dayAheadPrices({
    startDate: new Date().toISOString(),
    biddingZone: "10Y1001A1001A47J",
  }),
);
```

| Param       | Type   | Required | Default                | Info                                                                                                                                  |
| ----------- | ------ | -------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| biddingZone | String | true     |                        | Check out the utility [`BiddingZonesByCountry`](https://github.com/rabinage/entsoe-api-node#bidding-zones) for available zones/areas. |
| startDate   | String | true     |                        | ISO 8601 formated date string                                                                                                         |
| endDate     | String | false    | `startDate` + next day | ISO 8601 formated date string                                                                                                         |

- One year range limit applies
- Minimum time interval between `startDate` and `endDate` is one day

<details>
<summary>Output</summary>

```js
{
  "mRID": "d2ac60ea49be4a73b8dd3af014e19ff6",
  "revisionNumber": 1,
  "type": "A44",
  "senderMarketParticipantMRID": "10X1001A1001A450",
  "senderMarketParticipantMarketRoleType": "A32",
  "receiverMarketParticipantMRID": "10X1001A1001A450",
  "receiverMarketParticipantMarketRoleType": "A33",
  "createdDateTime": "2022-10-12T20:39:24Z",
  "timezone": "UTC",
  "period": {
    "timeInterval": { "start": "2022-08-11T22:00Z", "end": "2022-08-12T22:00Z" }
  },
  "timeSeries": [
    {
      "mRID": "1",
      "businessType": "A62",
      "inDomainMRID": "10Y1001A1001A47J",
      "outDomainMRID": "10Y1001A1001A47J",
      "currencyUnitName": "EUR",
      "priceMeasureUnitName": "MWH",
      "curveType": "A01",
      "period": {
        "timeInterval": {
          "start": "2022-08-11T22:00Z",
          "end": "2022-08-12T22:00Z"
        },
        "resolution": "PT60M",
        "point": [
          { "position": 1, "priceAmount": 411.97 },
          { "position": 2, "priceAmount": 395.28 },
          { "position": 3, "priceAmount": 386.2 },
          { "position": 4, "priceAmount": 382.55 },
          { "position": 5, "priceAmount": 392.89 },
          { "position": 6, "priceAmount": 398.21 },
          { "position": 7, "priceAmount": 469.21 },
          { "position": 8, "priceAmount": 513.31 },
          { "position": 9, "priceAmount": 508 },
          { "position": 10, "priceAmount": 472.56 },
          { "position": 11, "priceAmount": 419.9 },
          { "position": 12, "priceAmount": 405.6 },
          { "position": 13, "priceAmount": 376.39 },
          { "position": 14, "priceAmount": 328.45 },
          { "position": 15, "priceAmount": 334.37 },
          { "position": 16, "priceAmount": 372.09 },
          { "position": 17, "priceAmount": 393.24 },
          { "position": 18, "priceAmount": 448.08 },
          { "position": 19, "priceAmount": 478.23 },
          { "position": 20, "priceAmount": 546.56 },
          { "position": 21, "priceAmount": 551.83 },
          { "position": 22, "priceAmount": 495.59 },
          { "position": 23, "priceAmount": 458.21 },
          { "position": 24, "priceAmount": 413.84 }
        ]
      }
    }
  ]
}
```

</details>

### Miscellaneous

#### Bidding zones

An utility bidding zone map is also being exported by the package in order for you to make readable request while using the API.

```js
import { BiddingZonesByCountry } from "entsoe-api-node";

console.log(
  await client.dayAheadPrices({ biddingZone: BiddingZonesByCountry.SE4 }),
);
```

##### This project is based on the [node-module-swc-cjs](https://github.com/rabinage/starters/tree/main/node-module-swc-cjs) starter. Check it out for more production ready starters!
