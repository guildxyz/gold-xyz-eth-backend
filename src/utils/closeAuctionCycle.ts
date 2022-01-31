import { goldContract } from "../config/contract.js";
import { decodeContractError } from "./errors.js";
import getMaxBid from "./getMaxBid.js";
import { isOrderFillable, protocolFee } from "./zeroExExchangeUtils.js";

const closeAuctionCycle = async (auctionId: string) => {
  const maxBid = await getMaxBid(auctionId);

  if (maxBid === undefined) throw new Error("Cannot get the winning bid");

  if (!(await isOrderFillable(maxBid.order, maxBid.signature))) throw new Error("The winning bid is incorrect");

  const fee = await protocolFee();
  try {
    await goldContract.callStatic.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
      gasLimit: 2000000,
      value: fee,
    });
  } catch (error) {
    console.error(error);
    throw new Error(decodeContractError(error));
  }
  await goldContract.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
    value: fee,
  });
};

export default closeAuctionCycle;
