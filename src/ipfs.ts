import fleekStorage from "@fleekhq/fleek-storage-js";

const createFileKey = (auctionId: string, address: string) => auctionId.concat("/", address, ".json");

const getFile = async (fileKey: string) =>
  fleekStorage
    .get({
      apiKey: process.env.FLEEK_API_KEY,
      apiSecret: process.env.FLEEK_API_SECRET,
      key: fileKey,
      getOptions: ["data"],
    })
    .catch(() => undefined);

const listFiles = async (auctionId: string, options: string[]) =>
  fleekStorage.listFiles({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    prefix: auctionId,
    getOptions: options,
  });

const uploadFile = async (fileKey: string, data: string) =>
  fleekStorage.upload({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key: fileKey,
    data: data,
  });

const deleteFile = async (fileKey: string) =>
  fleekStorage.deleteFile({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key: fileKey,
  });

export { createFileKey, getFile, listFiles, uploadFile, deleteFile };
