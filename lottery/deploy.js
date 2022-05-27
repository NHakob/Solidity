const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  /* Put here your wallet mnemonic */
  'YOUR_MNEMONIC',
  /* Put here your project endpoint link */
  /* 
      To get that link you should go to infura.io. Sign in and create new project.
      Change endpoints to Rinkeby and copy https link 
  */
  'YOUR_INFURA_URL'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
