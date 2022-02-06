import { Logger } from "@ethersproject/logger";
import { goldContract } from "../config/contract.js";
import { createFileKey, deleteFile } from "../ipfs.js";
import { decodeContractError, ErrorWithCode } from "./errors.js";
import getMaxBid from "./getMaxBid.js";
import { orderInfo, protocolFee } from "./zeroExExchangeUtils.js";

/* eslint-disable no-await-in-loop, no-continue */
const closeAuctionCycle = async (auctionId: string) => {
  let maxBid;

  const auctionConfig = await goldContract.getAuctionConfig(auctionId);
  const auctionStatus = await goldContract.getAuctionStatus(auctionId);
  const cycle = auctionStatus.currentAuctionCycle.toString();

  if (auctionStatus.currentAuctionCycleStartTime.add(auctionConfig.cyclePeriod).gt(Math.ceil(Date.now() / 1000)))
    throw new ErrorWithCode("Auction cycle did not end yet", 500);
  if (!auctionStatus.isActive) throw new ErrorWithCode("Auction is not active", 500);
  if (auctionStatus.isFrozen) throw new ErrorWithCode("Auction is frozen", 500);

  const fee = await protocolFee();

  while (true) {
    maxBid = await getMaxBid(auctionId, cycle);

    if (maxBid === undefined)
      throw new ErrorWithCode(`Auction ${auctionId} does not exist or has no bids in cycle #${cycle}`, 404);

    if ((await orderInfo(maxBid.order))[0] !== 3) {
      await deleteFile(createFileKey(auctionId, cycle, maxBid.order.makerAddress));
      continue;
    }

    try {
      await goldContract.callStatic.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
        gasLimit: 2000000,
        value: fee,
      });
    } catch (error: any) {
      if (error.code !== Logger.errors.CALL_EXCEPTION) throw new ErrorWithCode(error.message, 500);
      await deleteFile(createFileKey(auctionId, cycle, maxBid.order.makerAddress));
      console.error(`Bid deleted: ${maxBid.order.makerAddress}, reason: ${decodeContractError(error)}`);
      continue;
    }

    break;
  }

  await goldContract.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
    value: fee,
  });
};

export default closeAuctionCycle;
