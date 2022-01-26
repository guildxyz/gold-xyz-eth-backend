import { orderHashUtils } from "@0x/order-utils";
import { goldContract } from "../config/contract.js";
import getMaxBid from "./getMaxBid.js";
import { orderInfo, protocolFee, isValidHashSignature, isValidOrderSignature } from "./ZeroExExchangeUtils.js";

// TODO: implement better error handling
const closeAuctionCycle = async (auctionId: string) => {
  try {
    const maxBid = await getMaxBid(auctionId);

    if (maxBid === undefined) return false;

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
        return false;
      }
      await goldContract.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
        value: fee,
      });
      return true;
    } else return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default closeAuctionCycle;
