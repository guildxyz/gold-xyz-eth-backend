import { createFileKey, deleteFile } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";
import { verifySignature } from "../../utils/signatures.js";

const deleteOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, order, signature } = req.body;
    if (verifySignature(order, signature)) {
      const fileKey = createFileKey(auctionId, order.makerAddress);
      await deleteFile(fileKey);
      res.status(200).json({ message: "Delete request sent" });
    } else throw new ErrorWithCode("Invalid signature", 403);
  } catch (error) {
    console.error(error);
    handleError("Deleting bid failed", error, res);
  }
};

export default deleteOrder;
