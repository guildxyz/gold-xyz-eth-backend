import { createPath, listFiles } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";

const getBids: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, cycle } = req.params;

    const files = await listFiles(createPath(auctionId, cycle), ["bucket", "key", "hash", "publicUrl"]);

    if (files.length === 0)
      throw new ErrorWithCode(`Auction ${auctionId} does not exist or has no bids in cycle #${cycle}`, 404);

    res.status(200).json({ bids: files });
  } catch (error) {
    console.error(error);
    handleError("Getting bids failed", error, res);
  }
};

export default getBids;
