import { db } from "../../lowdb.js";
import ControllerFunction from "../../types/ControllerFunction.js";

const saveOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, order, signature } = req.body;
    db.data[auctionId][order.makerAddress] = { order, signature };
    await db.write();
    res.status(200).json("Auction saved");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Saving auction failed" });
  }
};

export default saveOrder;
