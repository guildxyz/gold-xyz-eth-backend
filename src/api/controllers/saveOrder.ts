import { createFileKey, deleteFile, listBuckets, uploadFile } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";

const saveOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, order, signature } = req.body;
    const timestamp = Number(new Date());
    const data = { order, signature, timestamp };

    const fileKey = createFileKey(auctionId, order.makerAddress);
    const buckets = await listBuckets();

    // Delete the file to avoid collision
    await deleteFile(fileKey, buckets[0].name);

    const uploadedFile = await uploadFile(fileKey, JSON.stringify(data));

    if (uploadedFile === undefined) throw new ErrorWithCode("Saving bid failed", 500);

    res.status(200).json({ message: "Bid saved" });
  } catch (error) {
    console.error(error);
    handleError("Saving bid failed", error, res);
  }
};

export default saveOrder;
