import ControllerFunction from "../../types/ControllerFunction.js";
import { db } from "../../lowdb.js";

const closeCycle: ControllerFunction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    // TODO
    res.status(200).json({ message: "Under construction" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export default closeCycle;
