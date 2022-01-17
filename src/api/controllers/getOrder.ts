import ControllerFunction from "../../types/ControllerFunction.js";
import fleekStorage from "@fleekhq/fleek-storage-js";

const getOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, address } = req.params;
    const fileKey = auctionId.concat("/", address, ".json");
    const file = await fleekStorage
      .get({
        apiKey: process.env.FLEEK_API_KEY,
        apiSecret: process.env.FLEEK_API_SECRET,
        key: fileKey,
        getOptions: ["data"],
      })
      .catch(() => undefined);

    if (file === undefined) {
      res.status(404).json({ message: `Address ${address} has no bids in auction ${auctionId}` });
      return;
    }

    res.status(200).json(JSON.parse(file.data.toString()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export default getOrder;
