export const dayAheadPriceRT = (json) => {
  const r = json.Publication_MarketDocument;

  return {
    mRID: r.mRID[0],
    revisionNumber: parseInt(r.revisionNumber[0], 10),
    type: r.type[0],
    senderMarketParticipantMRID: r["sender_MarketParticipant.mRID"][0]._,
    senderMarketParticipantMarketRoleType:
      r["sender_MarketParticipant.marketRole.type"][0],
    receiverMarketParticipantMRID: r["receiver_MarketParticipant.mRID"][0]._,
    receiverMarketParticipantMarketRoleType:
      r["receiver_MarketParticipant.marketRole.type"][0],
    createdDateTime: r.createdDateTime[0],
    timezone: "UTC",
    period: {
      timeInterval: {
        start: r["period.timeInterval"][0].start[0],
        end: r["period.timeInterval"][0].end[0],
      },
    },
    timeSeries: r.TimeSeries.map((ts) => ({
      mRID: ts.mRID[0],
      businessType: ts.businessType[0],
      inDomainMRID: ts["in_Domain.mRID"][0]._,
      outDomainMRID: ts["out_Domain.mRID"][0]._,
      currencyUnitName: ts["currency_Unit.name"][0],
      priceMeasureUnitName: ts["price_Measure_Unit.name"][0],
      curveType: ts.curveType[0],
      period: {
        timeInterval: {
          start: ts.Period[0].timeInterval[0].start[0],
          end: ts.Period[0].timeInterval[0].end[0],
        },
        resolution: ts.Period[0].resolution[0],
        point: ts.Period[0].Point.map((po) => ({
          position: parseInt(po.position[0], 10),
          priceAmount: parseFloat(po["price.amount"][0]),
        })),
      },
    })),
  };
};

export const badRequestRT = (json) => {
  const r = json.Acknowledgement_MarketDocument.Reason[0];

  return {
    code: r.code[0],
    message: r.text[0],
  };
};

export const unauthRT = (json) => {
  return json.html.body[0];
};
