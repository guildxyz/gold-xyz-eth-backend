import { createFileKey, getFile } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";

const getOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, address } = req.params;

    const file = await getFile(createFileKey(auctionId, address));

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
