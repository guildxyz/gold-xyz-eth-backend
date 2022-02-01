import { Contract } from "@ethersproject/contracts";
import { Wallet } from "ethers";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import provider from "./provider.js";

const walletFile = await readFile(resolve("wallet.json"), {
  encoding: "utf-8",
});
const wallet = (await Wallet.fromEncryptedJson(walletFile, process.env.SERVER_WALLET_PW)).connect(provider);

const GOLD_ABI = await readFile(resolve(join("static", "goldAbi.json")), {
  encoding: "utf-8",
});

const EXCHANGE_ABI = await readFile(resolve(join("static", "exchangeAbi.json")), {
  encoding: "utf-8",
});

const goldContract = new Contract(process.env.GOLD_ADDRESS, GOLD_ABI, wallet);

const exchangeContract = new Contract(process.env.EXCHANGE_ADDRESS, EXCHANGE_ABI, wallet);

export { goldContract, exchangeContract };
