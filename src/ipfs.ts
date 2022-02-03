import fleekStorage from "@fleekhq/fleek-storage-js";

const createPath = (auctionId: string, cycle: string) => auctionId.concat("/", cycle);

const createFileKey = (auctionId: string, cycle: string, address: string) =>
  createPath(auctionId, cycle).concat("/", address, ".json");

const getFile = async (fileKey: string) =>
  fleekStorage
    .get({
      apiKey: process.env.FLEEK_API_KEY,
      apiSecret: process.env.FLEEK_API_SECRET,
      key: fileKey,
      getOptions: ["data"],
    })
    .catch(() => undefined);

const listFiles = async (path: string, options: string[]) =>
  fleekStorage.listFiles({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    prefix: path,
    getOptions: options,
  });

const uploadFile = async (fileKey: string, data: string) =>
  fleekStorage.upload({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key: fileKey,
    data,
  });

const deleteFile = async (fileKey: string) =>
  fleekStorage.deleteFile({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key: fileKey,
  });

export { createFileKey, createPath, getFile, listFiles, uploadFile, deleteFile };
