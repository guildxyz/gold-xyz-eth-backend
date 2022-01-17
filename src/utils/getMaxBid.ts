import fleekStorage from "@fleekhq/fleek-storage-js";

const getMaxBid = async (auctionId: string) => {
  try {
    let maxBid;

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

      // Initialize the variable
      if (i === 0) maxBid = data;

      // If the bid is higher or it's the same amount but older, update maxBid
      if (
        data.order.makerAssetAmount > maxBid.order.makerAssetAmount ||
        (data.order.makerAssetAmount === maxBid.order.makerAssetAmount && data.timestamp < maxBid.timestamp)
      )
        maxBid = data;
    }

    return maxBid;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export default getMaxBid;
