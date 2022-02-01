import { goldContract } from "../config/contract.js";
import { ErrorWithCode } from "./errors.js";

const getAuctions = async () => {
  try {
    const auctions = await goldContract.queryFilter(goldContract.filters.AuctionInitialized());
    return auctions.map((elem) => elem.args.auctionId);
  } catch (error) {
    console.error(error);
    throw new ErrorWithCode("Getting the list of auctions failed", 500);
  }
};

export default getAuctions;
