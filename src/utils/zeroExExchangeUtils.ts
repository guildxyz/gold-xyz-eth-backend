import { exchangeContract } from "../config/contract.js";
import provider from "../config/provider.js";

const orderInfo = async (order: object) => exchangeContract.getOrderInfo(order);

const protocolFee = async () => {
  const feeData = await provider.getFeeData();
  const protocolFeeMultiplier = await exchangeContract.protocolFeeMultiplier();
  return feeData.maxFeePerGas.add(feeData.maxPriorityFeePerGas).mul(protocolFeeMultiplier);
};

const isValidHashSignature = async (hash: string, address: string, signature: string) =>
  exchangeContract.isValidHashSignature(hash, address, signature);

const isValidOrderSignature = async (order: object, signature: string) =>
  exchangeContract.isValidOrderSignature(order, signature);

export { isValidHashSignature, isValidOrderSignature, orderInfo, protocolFee };
