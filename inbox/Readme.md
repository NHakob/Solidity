To run test need to install some packages.

To get all packages run this command in terminal under inbox directory:
npm install solc web3 mocha ganache-cli

To run a test use this command:
npm run test

If you want to deploy to mainnet or testnet run before this command:
npm install @truffle/hdwallet-provider

To deploy your contract put your mnemonic and infura url in deploy.js(place where need to put those are mentioned).
Then run this command to deploy:
node deploy.js