import ControllerFunction from "../../types/ControllerFunction.js";
import getMaxBid from "../../utils/getMaxBid.js";

const getWinningOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const winningBid = await getMaxBid(auctionId);
    if (winningBid === undefined)
      res.status(404).json({ message: `Auction ${auctionId} does not exist or has no bids yet` });
    else res.status(200).json(winningBid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export default getWinningOrder;
