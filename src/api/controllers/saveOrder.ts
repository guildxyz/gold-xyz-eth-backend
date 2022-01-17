import fleekStorage from "@fleekhq/fleek-storage-js";
import ControllerFunction from "../../types/ControllerFunction.js";

const saveOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, order, signature, bidId } = req.body;
    const data = { order, signature, bidId };
    const fileKey = auctionId.concat("/", order.makerAddress, ".json");

    const buckets = await fleekStorage.listBuckets({
      apiKey: process.env.FLEEK_API_KEY,
      apiSecret: process.env.FLEEK_API_SECRET,
    });

    //delete a file to avoid collision
    await fleekStorage.deleteFile({
      apiKey: process.env.FLEEK_API_KEY,
      apiSecret: process.env.FLEEK_API_SECRET,
      key: fileKey,
      bucket: buckets[0].name,
    });

    const uploadedFile = await fleekStorage.upload({
      apiKey: process.env.FLEEK_API_KEY,
      apiSecret: process.env.FLEEK_API_SECRET,
      key: fileKey,
      data: data,
    });

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
