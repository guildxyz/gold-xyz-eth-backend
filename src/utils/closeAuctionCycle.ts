import { orderHashUtils } from "@0x/order-utils";
import { goldContract } from "../config/contract.js";
import getMaxBid from "./getMaxBid.js";
import { orderInfo, protocolFee, isValidHashSignature, isValidOrderSignature } from "./ZeroExExchangeUtils.js";

const closeAuctionCycle = async (auctionId: string) => {
  try {
    const maxBid = await getMaxBid(auctionId);

    if (maxBid === undefined) throw new Error("Cannot get the winning bid");

    const orderHash = orderHashUtils.getOrderHash(maxBid.order);
    const hashSignature = await isValidHashSignature(orderHash, maxBid.order.makerAddress, maxBid.signature);
    const orderSignature = await isValidOrderSignature(maxBid.order, maxBid.signature);
    const info = await orderInfo(maxBid.order);
    if (hashSignature && orderSignature && info[0] === 3) {
      const fee = await protocolFee();
      try {
        await goldContract.callStatic.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
          gasLimit: 2000000,
          value: fee,
        });
      } catch (error) {
        console.error(error);
        // TODO: try to decode revert reason or error name/params
        throw new Error("Auction cycle cannot be closed in the contract");
      }
      await goldContract.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
        value: fee,
      });
    } else throw new Error("The winning bid is incorrect");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default closeAuctionCycle;
