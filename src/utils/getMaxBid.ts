import fleekStorage from "@fleekhq/fleek-storage-js";

const getMaxBid = async (auctionId: string) => {
  try {
    let maxBid;
    let maxAmount = 0;
    let maxBidId = 0;
    const files = await fleekStorage.listFiles({
      apiKey: process.env.FLEEK_API_KEY,
      apiSecret: process.env.FLEEK_API_SECRET,
      prefix: auctionId,
      getOptions: ["key"],
    });

    for (let i = 0; i < files.length; i++) {
      const file = await fleekStorage.get({
        apiKey: process.env.FLEEK_API_KEY,
        apiSecret: process.env.FLEEK_API_SECRET,
        key: files[i].key,
        getOptions: ["data"],
      });
      const data = JSON.parse(file.data.toString());
      if (data.order.makerAssetAmount > maxAmount) {
        maxBid = data;
        maxAmount = data.order.makerAssetAmount;
        maxBidId = data.bidId;
      } else if (data.order.makerAssetAmount === maxAmount) {
        if (data.bidId < maxBidId) {
          maxBid = data;
          maxBidId = data.bidId;
        }
      }
    }
    return maxBid;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export default getMaxBid;
