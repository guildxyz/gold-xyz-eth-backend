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

export { ErrorWithCode, handleError };
