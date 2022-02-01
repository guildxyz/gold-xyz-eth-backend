import { listFiles } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";

const getOrders: ControllerFunction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const files = await listFiles(auctionId, ["bucket", "key", "hash", "publicUrl"]);

    if (files.length === 0) throw new ErrorWithCode(`Auction ${auctionId} does not exist or has no bids yet`, 404);

    res.status(200).json({ orders: files });
  } catch (error) {
    console.error(error);
    handleError("Getting bids failed", error, res);
  }
};

export default getOrders;
