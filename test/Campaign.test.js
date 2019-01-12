const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../Ethereum/build/FactoryCampaign.json");
const compiledCampaign = require("../Ethereum/build/Campaign.json");

let accounts;
let factory;
let CampaignAddress;
let Campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000"
  });
  [CampaignAddress] = await factory.methods.getDeployedCampaigns().call();
  Campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    CampaignAddress
  );
});
