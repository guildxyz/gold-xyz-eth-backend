import { createFileKey, getFile } from "../../ipfs.js";
import ControllerFunction from "../../types/ControllerFunction.js";
import { ErrorWithCode, handleError } from "../../utils/errors.js";

const getOrder: ControllerFunction = async (req, res) => {
  try {
    const { auctionId, address } = req.params;

    const file = await getFile(createFileKey(auctionId, address));

    if (file === undefined) throw new ErrorWithCode(`Address ${address} has no bids in auction ${auctionId}`, 404);

    res.status(200).json(JSON.parse(file.data.toString()));
  } catch (error) {
    console.error(error);
    handleError("Getting bid failed", error, res);
  }
};

export default getOrder;
