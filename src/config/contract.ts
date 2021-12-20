import { Contract } from "@ethersproject/contracts";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import provider from "./provider.js";

const GOLD_ABI = await readFile(resolve(join("static", "goldAbi.json")), {
  encoding: "utf-8",
});

const contract = new Contract(process.env.GOLD_ADDRESS, GOLD_ABI, provider);

export default contract;
