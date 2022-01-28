import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";
import getMaxBid from "../../utils/getMaxBid.js";

const getWinningOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const winningBid = await getMaxBid(auctionId);
    if (winningBid === undefined)
      throw new ErrorWithCode(`Auction ${auctionId} does not exist or has no bids yet`, 404);
    res.status(200).json(winningBid);
  } catch (error) {
    console.error(error);
    handleError("Getting bid failed", error, res);
  }
};

export default getWinningOrder;
