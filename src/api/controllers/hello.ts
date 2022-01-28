import ControllerFunction from "../../types/ControllerFunction.js";
import { handleError } from "../../utils/errors.js";

const hello: ControllerFunction = (req, res) => {
  try {
    res.status(200).json({ message: `Hello ${req.query.name === undefined ? "friend" : req.query.name}` });
  } catch (error) {
    handleError("Bruh", error, res);
  }
};

export default hello;
