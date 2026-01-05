import { MockAgent, setGlobalDispatcher } from "undici";
import { formatDate } from "../src/utils.js";

const BASE_URL = "https://web-api.tp.entsoe.eu";
const BiddingZonesByCountry = {
  SE4: "10Y1001A1001A47J",
};

export const biddingZone = BiddingZonesByCountry.SE4; // Sweden zone 4
export const apiToken = "token";
export const startDate = "2023-08-07T00:00:00.000Z";
export const endDate = "2023-08-08T00:00:00.000Z";

export function createApiMock() {
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
      periodEnd: formatDate(new Date(endDate)),
      periodStart: formatDate(new Date(startDate)),
      documentType: "A44",
      securityToken: apiToken,
    },
  });

  return { baseInterceptor, mockAgent };
}
