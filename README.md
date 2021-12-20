# Gold.xyz (Ethereum) Backend

The app in this repository is a backend for [gold.xyz](https://gold.xyz)'s Ethereum version found [here](https://github.com/agoraxyz/gold-xyz-eth). It's sole purpose is to store bids and close auction cycles periodically.

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

