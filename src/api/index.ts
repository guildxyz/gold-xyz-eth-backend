import { Router } from "express";
import * as controller from "./controllers/index.js";

export default () => {
  const api = Router();

  api.get("/api/hello", controller.hello);
  api.get("/api/bidders/:auctionId/:cycle", controller.getBidders);
  api.get("/api/bids/:auctionId/:cycle", controller.getBids);
  api.get("/api/bids/:auctionId/:cycle/winning", controller.getWinningBid);
  api.get("/api/bids/:auctionId/:cycle/:address", controller.getBid);

  api.post("/api/close-cycle", controller.closeCycle);
  api.post("/api/save-bid", controller.saveBid);

  api.delete("/api/delete-bid", controller.deleteBid);

  return api;
};
