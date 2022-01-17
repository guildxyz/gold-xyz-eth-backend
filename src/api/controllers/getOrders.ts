import ControllerFunction from "../../types/ControllerFunction.js";
import fleekStorage from "@fleekhq/fleek-storage-js";

const getOrders: ControllerFunction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const files = await fleekStorage.listFiles({
      apiKey: process.env.FLEEK_API_KEY,
      apiSecret: process.env.FLEEK_API_SECRET,
      prefix: auctionId,
      getOptions: ["bucket", "key", "hash", "publicUrl"],
    });

    if (files.length === 0) {
      res.status(404).json({ message: `Auction ${auctionId} does not exist or has no bids yet` });
      return;
    }

    res.status(200).json({ orders: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export default getOrders;
