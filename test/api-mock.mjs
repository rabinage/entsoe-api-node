import { MockAgent, setGlobalDispatcher } from "undici";
import { BASE_URL } from "../src/const.mjs";
import { BiddingZonesByCountry } from "../src/index.mjs";

export const biddingZone = BiddingZonesByCountry.SE4; // Sweden zone 4
export const apiToken = "token";
export const startDate = "2023-08-07T00:00:00.000Z";
export const endDate = "2023-08-08T00:00:00.000Z";

const mockAgent = new MockAgent();
mockAgent.disableNetConnect();
setGlobalDispatcher(mockAgent);
const apiMock = mockAgent.get(BASE_URL);
const baseInterceptor = apiMock.intercept({
  headers: {
    "Content-Type": "application/xml",
  },
  method: "GET",
  path: "/api",
  query: {
    in_Domain: biddingZone,
    out_Domain: biddingZone,
    timeInterval: `${startDate}/${endDate}`,
    documentType: "A44",
    securityToken: apiToken,
  },
});

export { baseInterceptor, mockAgent };
