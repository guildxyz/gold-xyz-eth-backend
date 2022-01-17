import verifySignature from "../../utils/verifySignature.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { createFileKey, listBuckets, deleteFile } from "../../ipfs.js";

const deleteOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, order, signature } = req.body;
    if (verifySignature(order, signature)) {
      let validCycle: boolean; // TODO: ensure that the order's cycle is the current or a future cycle
      if (!validCycle)
        res.status(500).json({ message: "The cycle is already expired, therefore the bid cannot be deleted" });
      else {
        const fileKey = createFileKey(auctionId, order.makerAddress);
        const buckets = await listBuckets();
        await deleteFile(fileKey, buckets[0].name);
        res.status(200).json({ message: "Delete request sent" });
      }
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
