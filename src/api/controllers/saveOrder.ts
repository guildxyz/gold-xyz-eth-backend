import { assetDataUtils, ERC20AssetData, ERC721AssetData } from "@0x/order-utils";
import { goldContract } from "../../config/contract.js";
import { createFileKey, deleteFile, uploadFile } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";
import getAuctions from "../../utils/getAuctions.js";
import { isOrderFillable } from "../../utils/zeroExExchangeUtils.js";

const saveOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, order, signature } = req.body;
    const timestamp = Number(new Date());
    const data = { order, signature, timestamp };

    const auctions = await getAuctions();
    if (!auctions.includes(auctionId)) throw new ErrorWithCode(`Auction ${auctionId} does not exist`, 404);

    if (!(await isOrderFillable(order, signature))) throw new ErrorWithCode("The bid is incorrect", 500);

    const auctionConfig = await goldContract.getAuctionConfig(auctionId);
    const auctionStatus = await goldContract.getAuctionStatus(auctionId);
    if (auctionConfig.minimumBidAmount.gt(order.makerAssetAmount)) throw new ErrorWithCode("Bid too low", 500);
    if (auctionStatus.currentAuctionCycleStartTime.add(auctionConfig.cyclePeriod).lt(Math.ceil(Date.now() / 1000)))
      throw new ErrorWithCode("Auction cycle ended", 500);
    if (!auctionStatus.isActive) throw new ErrorWithCode("Auction is not active", 500);
    if (auctionStatus.isFrozen) throw new ErrorWithCode("Auction is frozen", 500);

    const bidderTokenAssetData = assetDataUtils.decodeAssetDataOrThrow(order.makerAssetData) as ERC20AssetData;
    if (bidderTokenAssetData.tokenAddress !== auctionConfig.bidderTokenAddress.toLowerCase())
      throw new ErrorWithCode("Bid with an incorrect token", 500);

    const nftAssetData = assetDataUtils.decodeAssetDataOrThrow(order.takerAssetData) as ERC721AssetData;
    if (nftAssetData.tokenAddress !== auctionConfig.nftAddress.toLowerCase())
      throw new ErrorWithCode("Bid for a different NFT address", 500);
    if (!auctionStatus.currentAuctionCycle.eq(Number(nftAssetData.tokenId.toString())))
      throw new ErrorWithCode("Bid for a different NFT id", 500);

    const fileKey = createFileKey(auctionId, auctionStatus.currentAuctionCycle.toString(), order.makerAddress);

    // Delete the file to avoid collision
    await deleteFile(fileKey);

    const uploadedFile = await uploadFile(fileKey, JSON.stringify(data));

    if (uploadedFile === undefined) throw new ErrorWithCode("Saving bid failed", 500);

    res.status(200).json({ message: "Bid saved" });
  } catch (error) {
    console.error(error);
    handleError("Saving bid failed", error, res);
  }
};

export default saveOrder;
