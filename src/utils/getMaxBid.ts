import { createPath, getFile, listFiles } from "../ipfs.js";

const getMaxBid = async (auctionId: string, cycle: string) => {
  try {
    let maxBid;

    const files = await listFiles(createPath(auctionId, cycle), ["key"]);

    if (files.length === 0) return undefined;

    for (let i = 0; i < files.length; i += 1) {
      // Note: await is fine here, as we don't want to store all files in the memory at once
      // eslint-disable-next-line no-await-in-loop
      const file = await getFile(files[i].key);
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
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export default getMaxBid;
