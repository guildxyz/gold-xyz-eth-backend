import { createPath, listFiles } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";

const getBidders: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, cycle } = req.params;

    const files = await listFiles(createPath(auctionId, cycle), ["key"]);

    if (files.length === 0)
      throw new ErrorWithCode(`Auction ${auctionId} does not exist or has no bids in cycle #${cycle}`, 404);

    const bidders = files.map((elem) => elem.key.split("/").at(-1).split(".")[0]);

    res.status(200).json({ bidders });
  } catch (error) {
    console.error(error);
    handleError("Getting addresses failed", error, res);
  }
};

export default getBidders;
