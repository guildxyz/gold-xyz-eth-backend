import ControllerFunction from "../../types/ControllerFunction.js";
import closeAuctionCycle from "../../utils/closeAuctionCycle.js";

const closeCycle: ControllerFunction = async (req, res) => {
  try {
    const { auctionId } = req.body;
    if (await closeAuctionCycle(auctionId))
      res.status(200).json({ message: `Closing the current cycle of ${auctionId}` });
    else res.status(500).json({ message: `Closing the current cycle of ${auctionId} failed` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export default closeCycle;
