const HDWalletrovider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");
//Hd wallet - 2 arguments -mnemonic(12 word phrase),infura link for test net

const provider = new HDWalletrovider(
  "high floor write inside usage obey aisle uniform rigid afford ancient assume",
  "https://rinkeby.infura.io/v3/39ab0b6446de410581b26b3de8f89c1a"
);
const web3 = new Web3(provider);
async function deploy() {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to Deploy from Account:", accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 1000000 });
  //IMPORTANT STEP where contract got deployed
  //We Will Add this to our React Networka
  console.log(interface);
  console.log("Contract deployed to:", result.options.address);
}
deploy();
