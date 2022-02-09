# Gold.xyz (Ethereum) Backend

The app in this repository is a backend for [gold.xyz](https://gold.xyz)'s Ethereum version found [here](https://github.com/agoraxyz/gold-xyz-eth). It's sole purpose is to store bids on [IPFS](https://ipfs.io) and close auction cycles in the contract periodically.

## Requirements

To run the project you need:

- [Node.js](https://nodejs.org) development environment, version 14.13.1 or newer.
- A file named `.env`. An example can be found in the project's root folder.

## Usage

Pull the repository from GitHub, then install its dependencies by executing this command:

```bash
npm install
```

To start the project in production mode:

```bash
npm start
```

Or, to start the project in development mode:

```bash
npm run dev
```

This will start the app on localhost on the port configured in the _.env_ file.

## Endpoints

### GET

- `api/bidders/:auctionId/:cycle` - returns a list of bidders in a certain cycle of an auction
- `api/bids/:auctionId/:cycle` - returns all bids in a certain cycle of an auction
- `api/bids/:auctionId/:cycle/:address` - returns the bid of a certain address in a certain cycle of an auction
- `api/bids/:auctionId/:cycle/winning` - returns the winning bid in a certain cycle of an auction
- `api/hello?name=` - a test endpoint with an optional parameter

### POST

- `api/close-cycle` - accepts the auction's id in the request's body. Automatically selects the winning bid from the last open cycle of that auction (deletes any that are incorrect or whose owner doesn't have the required funds/allowances). Lastly, initiates a transaction to close the cycle in the contract.

  - example body:
    ```json
    { "auctionId": "someAuction" }
    ```

- `api/save-bid` - validates and saves bids on IPFS.

  - body: contains the auction's id, the bid in the form of a 0x order and it's signature (signed via 0x utils). See `/example/save-input-example.json`.

### DELETE

- `api/delete-bid` - deletes a bid from IPFS. Note that due to the nature of IPFS we can't 100% ensure that the bid will be gone forever.

  - body: contains the auction's id, cycle, the bidder's address and a signature: the bid's salt signed via _eth_sign_. See `/example/delete-input-example.json`. Signing example using [ethers.js](https://github.com/ethers-io/ethers.js):

    ```js
    const message = JSON.stringify(input); // "input" is the data to be signed, i.e. the salt of the bid to be deleted
    const signature = await wallet.signMessage(message); // The signature we need.
    console.log(ethers.utils.verifyMessage(message, signature)); // Should return the signer's address.
    ```
