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

const listBuckets = async () =>
  fleekStorage.listBuckets({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
  });

const uploadFile = async (fileKey: string, data: string) =>
  fleekStorage.upload({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key: fileKey,
    data,
  });

const deleteFile = async (fileKey: string, bucketName: string) =>
  fleekStorage.deleteFile({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key: fileKey,
    bucket: bucketName,
  });

export { createFileKey, getFile, listFiles, listBuckets, uploadFile, deleteFile };
