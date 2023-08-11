declare module "entsoe-api-node" {
  /**
   * Unofficial API wrapper for the ENTSO-E Transparency Platform.
   *
   * @see {@link https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html} ENTSO-E Transparency Platform RESTful API documentation.
   * @see {@link https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html#_complete_parameter_list} Entsoe Transparency Platform RESTful API Appendix.
   * @see {@link https://github.com/rabinage/entsoe-api-node} Wrapper documentation.
   * @param {string} apiToken - API security token {@link https://github.com/rabinage/entsoe-api-node#getting-started}.
   * @param {boolean} testnet - Optional. For testing purpose only.
   */
  export default function (options?: {
    apiToken: string;
    testnet?: boolean;
  }): Entsoe;

  /**
   * A.15. Areas divided into country codes, followed by potential zone number.
   */
  export const enum BiddingZonesByCountry {
    AL = "10YAL-KESH-----5", // Albania
    AT = "10Y1001A1001A63L", // Austria
    BA = "10YBA-JPCC-----D", // Bosnia and Herzegovina
    BE = "10YBE----------2", // Belgium
    BG = "10YCA-BULGARIA-R", // Bulgaria
    CH = "10YCH-SWISSGRIDZ", // Switzerland
    CZ = "10YCZ-CEPS-----N", // Czech Republic
    DK1 = "10YDK-1--------W", // Denmark zone 1
    DK2 = "10YDK-2--------M", // Denmark zone 2
    DE = "10Y1001A1001A63L", // Germany
    EE = "10Y1001A1001A39I", // Estonia
    ES = "10YES-REE§------0", // Spain
    FI = "10YFI-1--------U", // Finland
    FR = "10YFR-RTE------C", // France
    UK = "10YGB----------A", // United Kingdom
    GR = "10YGR-HTSO-----Y", // Greece
    HR = "10YHR-HEP------M", // Croatia
    HU = "10YHU-MAVIR----U", // Hungary
    IR = "10Y1001A1001A59C", // Ireland
    IT1 = "10Y1001A1001A73I", // Italy zone 1
    IT2 = "10Y1001A1001A70O", // Italy zone 2
    IT3 = "10Y1001A1001A71M", // Italy zone 3
    IT4 = "10Y1001A1001A788", // Italy zone 4
    IT5 = "10Y1001A1001A74G", // Italy zone 5
    IT6 = "10Y1001A1001A75E", // Italy zone 6
    LT = "10YLT-1001A0008Q", // Lithuania
    LU = "10Y1001A1001A63L", // Luxemburg
    LV = "10YLV-1001A00074", // Latvia
    ME = "10YCS-CG-TSO---S", // Montenegro
    MK = "10YMK-MEPSO----8", // FYROM (Former Yugoslav Republic of Macedonia)
    NL = "10YNL----------L", // The Netherlands
    NO1 = "10YNO-1--------2", // Norway zone 1
    NO2 = "10YNO-2--------T", // Norway zone 2
    NO3 = "10YNO-3--------J", // Norway zone 3
    NO4 = "10YNO-4--------9", // Norway zone 4
    NO5 = "10Y1001A1001A48H", // Norway zone 5
    PL = "10YPL-AREA-----S", // Poland
    PT = "10YPT-REN------W", // Portugal
    RO = "10YRO-TEL------P", // Romania
    RS = "10YCS-SERBIATSOV", // Serb
    SE1 = "10Y1001A1001A44P", // Sweden zone 1
    SE2 = "10Y1001A1001A45N", // Swden zone 2
    SE3 = "10Y1001A1001A46L", // Swden zone 3
    SE4 = "10Y1001A1001A47J", // Sweden zone 4
    SL = "10YSI-ELES-----O", // Slovenia
    SK = "10YSK-SEPS-----K", // Slovak Republic
  }

  export type ResponseTransformer = (xmlString: string) => Promise<Object>;

  export type TimeInterval = {
    start: string;
    end: string;
  };

  export interface DayAheadResult {
    mRID: string;
    revisionNumber: number;
    type: string;
    senderMarketParticipantMRID: string;
    senderMarketParticipantMarketRoleType: string;
    receiverMarketParticipantMRID: string;
    receiverMarketParticipantMarketRoleType: string;
    createdDateTime: string;
    timezone: string;
    period: {
      timeInterval: TimeInterval;
    };
    timeSeries: [
      {
        mRID: string;
        businessType: string;
        inDomainMRID: string;
        outDomainMRID: string;
        currencyUnitName: string;
        priceMeasureUnitName: string;
        curveType: string;
        period: {
          timeInterval: TimeInterval;
          resolution: string;
          point: [
            {
              position: number;
              priceAmount: number;
            },
          ];
        };
      },
    ];
  }

  interface DayAheadPriceResponseTransformer extends ResponseTransformer {}

  export interface Entsoe {
    /**
     * A.12.1.D. Day ahead prices.
     *
     * @param {string} biddingZone - Bidding zone/area code.
     * @param {string} startDate - ISO 8601 formated date string.
     * @param {string} endDate - Optional. ISO 8601 formated date string.
     */
    dayAheadPrices(
      payload: {
        biddingZone: string;
        startDate?: string;
        endDate?: string;
      },
      transformResponse: DayAheadPriceResponseTransformer | ResponseTransformer,
    ): Promise<DayAheadResult>;
  }
}
