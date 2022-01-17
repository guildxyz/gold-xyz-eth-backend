import ControllerFunction from "../../types/ControllerFunction.js";
import { createFileKey, listBuckets, uploadFile, deleteFile } from "../../ipfs.js";

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

    if (uploadedFile !== undefined) {
      res.status(200).json({ message: "Bid saved" });
      return;
    }
    res.status(500).json({ message: "Saving bid failed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Saving bid failed" });
  }
};

export default saveOrder;
