import { createFileKey, deleteFile, listBuckets } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import verifySignature from "../../utils/verifySignature.js";
import { createFileKey, deleteFile } from "../../ipfs.js";

const deleteOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, order, signature } = req.body;
    if (verifySignature(order, signature)) {
      const fileKey = createFileKey(auctionId, order.makerAddress);
      await deleteFile(fileKey);
      res.status(200).json({ message: "Delete request sent" });
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
