import { Router } from "express";
import * as controller from "./controllers/index.js";

export default () => {
  const api = Router();

  api.get("/api/hello", controller.hello);
  api.get("/api/orders/:auctionId/:cycle", controller.getOrders);
  api.get("/api/orders/:auctionId/:cycle/winning", controller.getWinningOrder);
  api.get("/api/orders/:auctionId/:cycle/:address", controller.getOrder);

  api.post("/api/close-cycle", controller.closeCycle);
  api.post("/api/save-order", controller.saveOrder);

  api.delete("/api/delete-order", controller.deleteOrder);

  return api;
};
