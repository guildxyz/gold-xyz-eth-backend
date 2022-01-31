import { Logger } from "@ethersproject/logger";
import axios from "axios";
import type { Response } from "express";

class ErrorWithCode extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

const handleError = (message: string, error: any, res: Response): void => {
  res.status(error instanceof ErrorWithCode ? error.code : 500).json({
    message,
    error:
      axios.isAxiosError(error) && error?.response?.data
        ? error.response.data
        : error instanceof Error
        ? error.message
        : error,
  });
};

const decodeContractError = (error: any): string => {
  if (error.code !== Logger.errors.CALL_EXCEPTION) return error.message;
  let reason;
  switch (error.errorName) {
    case "MaxNFTNumberReached":
      reason = "Reached the maximum number of NFTs";
      break;
    default:
      reason = `${error.errorName}: ${error.errorArgs}`;
      break;
  }
  return `The transaction would fail: ${reason}.`;
};

export { ErrorWithCode, decodeContractError, handleError };
