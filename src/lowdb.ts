import { JSONFile, Low } from "lowdb";
import { join, resolve } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const dataDir = resolve(join("data"));
const dbFileName = "db.json";

const dbFile = join(dataDir, dbFileName);

if (!existsSync(dbFile)) {
  if (!existsSync(dataDir)) mkdirSync(dataDir);
  writeFileSync(dbFile, "{}");
}

const adapter = new JSONFile<
  Record<
    string, // auctionId
    {
      [account: string]: {
        order: {
          chainId: number;
          exchangeAddress: string;
          makerAddress: string;
          takerAddress: string;
          feeRecipientAddress: string;
          senderAddress: string;
          makerAssetAmount: number;
          takerAssetAmount: number;
          makerFee: number;
          takerFee: number;
          expirationTimeSeconds: number;
          salt: string;
          makerAssetData: string;
          takerAssetData: string;
          makerFeeAssetData: string;
          takerFeeAssetData: string;
        };
        signature: string;
      };
    }
  >
>(dbFile);
const db = new Low(adapter);

await db.read();

if (!db.data) db.data = {};

// eslint-disable-next-line import/prefer-default-export
export { db };
