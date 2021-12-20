import ControllerFunction from "../../types/ControllerFunction.js";
import { db } from "../../lowdb.js";

const getOrders: ControllerFunction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const address = req.query.address?.toString();
    await db.read();
    if (!db.data[auctionId] || Object.keys(db.data[auctionId]).length <= 0)
      res.status(404).json({ message: `Auction ${auctionId} does not exist or has no bids yet` });
    else if (!address) res.status(200).json({ orders: db.data[auctionId] });
    else if (Object.keys(db.data[auctionId]).includes(address)) res.status(200).json(db.data[auctionId][address]);
    else res.status(404).json({ message: `Address ${address} has no bids in auction ${auctionId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export default getOrders;
