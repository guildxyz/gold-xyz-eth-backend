import { db } from "../lowdb.js";

const getMaxBid = async (auctionId: string) => {
  try {
    await db.read();
    if (!db.data[auctionId] || Object.keys(db.data[auctionId]).length <= 0) return -1;
    const bidder = Object.keys(db.data[auctionId]).reduce((prev, curr) =>
      db.data[auctionId][prev]?.order.makerAssetAmount > db.data[auctionId][curr]?.order.makerAssetAmount ? prev : curr
    );
    return db.data[auctionId][bidder];
  } catch (e) {
    console.error(e);
  }
};

export default getMaxBid;
