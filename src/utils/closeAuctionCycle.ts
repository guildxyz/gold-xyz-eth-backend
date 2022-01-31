import { orderHashUtils } from "@0x/order-utils";
import { goldContract } from "../config/contract.js";
import { decodeContractError } from "./errors.js";
import getMaxBid from "./getMaxBid.js";
import { isValidHashSignature, isValidOrderSignature, orderInfo, protocolFee } from "./zeroExExchangeUtils.js";

const closeAuctionCycle = async (auctionId: string) => {
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
      throw new Error(decodeContractError(error));
    }
    await goldContract.closeAuctionCycle(maxBid.order, maxBid.signature, auctionId, {
      value: fee,
    });
  } else throw new Error("The winning bid is incorrect");
};

export default closeAuctionCycle;
