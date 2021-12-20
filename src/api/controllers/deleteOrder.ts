import { db } from "../../lowdb.js";
import verifySignature from "../../utils/verifySignature.js";
import ControllerFunction from "../../types/ControllerFunction.js";

const deleteOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, order, signature } = req.body;
    if (verifySignature(order, signature)) {
      await db.read();
      let validCycle: boolean; // TODO: ensure that the order's cycle is the current or a future cycle
      if (!validCycle)
        res.status(500).json({ message: "The cycle is already expired, therefore the bid cannot be deleted" });
      else if (auctionId in db.data && order.makerAddress in db.data[auctionId]) {
        if (delete db.data[auctionId][order.makerAddress]) {
          await db.write();
          res.status(200).json({ message: `${order.makerAddress}'s bid in ${auctionId} successfully deleted` });
        } else res.status(500).json({ message: "Deleting bid failed" });
      } else res.status(404).json({ message: `Bid does not exist` });
    } else res.status(401).json({ message: "Invalid signature" });
  } catch (error) {
    if ((error as Error).message === "Incorrect signature")
      res.status(500).json({ message: "Incorrect signature provided" });
    else {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  }
};

export default deleteOrder;
