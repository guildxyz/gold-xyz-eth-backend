import { goldContract } from "../config/contract.js";
import { decodeContractError, ErrorWithCode } from "./errors.js";
import getMaxBid from "./getMaxBid.js";
import { isOrderFillable, protocolFee } from "./zeroExExchangeUtils.js";

const closeAuctionCycle = async (auctionId: string) => {
  const maxBid = await getMaxBid(auctionId);

  if (maxBid === undefined) throw new ErrorWithCode(`Auction ${auctionId} does not exist or has no bids yet`, 404);

  if (!(await isOrderFillable(maxBid.order, maxBid.signature)))
    throw new ErrorWithCode("The winning bid is incorrect", 500);

  const fee = await protocolFee();
  try {
    await goldContract.callStatic.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
      gasLimit: 2000000,
      value: fee,
    });
  } catch (error) {
    console.error(error);
    throw new ErrorWithCode(decodeContractError(error), 500);
  }
  await goldContract.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
    value: fee,
  });
};

export default closeAuctionCycle;
