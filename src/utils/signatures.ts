import { utils } from "ethers";
import { ErrorWithCode } from "./errors.js";

const getMessageSigner = (message: string, signature: string) => {
  try {
    return utils.verifyMessage(message, signature);
  } catch (error) {
    throw new ErrorWithCode("Incorrect signature provided", 400);
  }
};

const verifySignature = (message: object, signature: string) =>
  getMessageSigner(JSON.stringify(message), signature) === process.env.ADMIN_ADDRESS;

export { getMessageSigner, verifySignature };
