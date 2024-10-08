import { Order, orderHashUtils } from "@0x/order-utils";
import { exchangeContract } from "../config/contract.js";
import provider from "../config/provider.js";

const orderInfo = async (order: Order) => exchangeContract.getOrderInfo(order);

const protocolFee = async () => {
  const feeData = await provider.getFeeData();
  const protocolFeeMultiplier = await exchangeContract.protocolFeeMultiplier();
  return feeData.maxFeePerGas.add(feeData.maxPriorityFeePerGas).mul(protocolFeeMultiplier);
};

const isValidHashSignature = async (hash: string, address: string, signature: string) =>
  exchangeContract.isValidHashSignature(hash, address, signature);

const isValidOrderSignature = async (order: Order, signature: string) =>
  exchangeContract.isValidOrderSignature(order, signature);

const isOrderFillable = async (order: Order, signature: string) => {
  try {
    const hashSignature = await isValidHashSignature(orderHashUtils.getOrderHash(order), order.makerAddress, signature);
    const orderSignature = await isValidOrderSignature(order, signature);
    const info = await orderInfo(order);
    return hashSignature && orderSignature && info[0] === 3;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export { isOrderFillable, isValidHashSignature, isValidOrderSignature, orderInfo, protocolFee };
