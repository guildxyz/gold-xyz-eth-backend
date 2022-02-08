import { createPath, getFile, listFiles } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";

const getBids: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, cycle } = req.params;

    const list = await listFiles(createPath(auctionId, cycle), ["key"]);

    if (list.length === 0)
      throw new ErrorWithCode(`Auction ${auctionId} does not exist or has no bids in cycle #${cycle}`, 404);

    const bids = (await Promise.all(list.map((ref) => getFile(ref.key)))).map((file) =>
      JSON.parse(file.data.toString())
    );

    res.status(200).json({ bids });
  } catch (error) {
    console.error(error);
    handleError("Getting bids failed", error, res);
  }
};

export default getBids;
