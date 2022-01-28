import ControllerFunction from "../../types/ControllerFunction.js";
import closeAuctionCycle from "../../utils/closeAuctionCycle.js";
import { handleError } from "../../utils/errors.js";

const closeCycle: ControllerFunction = async (req, res) => {
  let auctionId;
  try {
    auctionId = req.body.auctionId;
    await closeAuctionCycle(auctionId);
    res.status(200).json({ message: `Closing the current cycle of ${auctionId}` });
  } catch (error) {
    console.error(error);
    handleError(`Closing cycle failed: ${auctionId}`, error, res);
  }
};

export default closeCycle;
