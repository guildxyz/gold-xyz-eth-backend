import { createFileKey, deleteFile, getFile } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";
import { verifySignature } from "../../utils/signatures.js";

const deleteOrder: ControllerFunction = async (req, res) => {
  try {
    // signature: the order's salt is signed
    const { auctionId, address, signature } = req.body;

    const fileKey = createFileKey(auctionId, address);
    const file = await getFile(fileKey);
    if (file === undefined) throw new ErrorWithCode(`Address ${address} has no bids in auction ${auctionId}`, 404);

    if (!verifySignature(JSON.parse(file.data.toString()).order.salt, signature, address))
      throw new ErrorWithCode("Invalid signature", 403);

    await deleteFile(fileKey);

    res.status(200).json({ message: "Delete request sent" });
  } catch (error) {
    console.error(error);
    handleError("Deleting bid failed", error, res);
  }
};

export default deleteOrder;
