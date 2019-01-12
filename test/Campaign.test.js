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

describe("Campaigns", () => {
  it("deploys a factoty and a Campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(Campaign.options.address);
  });
  it("marks Caller as Capmaign as the Manager", async () => {
    const manager = await Campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });
  it("Allows people to Contribyte Money And MArk them as Approvers", async () => {
    await Campaign.methods.contribute().send({
      value: "200",
      from: accounts[1]
    });
    const isContributor = await Campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
  it("requires a minimum contribution", async () => {
    try {
      await Campaign.methods.contribute().send({
        value: "5",
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("allows a manager to make request", async () => {
    await Campaign.methods
      .createRequest("Buy Batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000"
      });
    const request = await Campaign.methods.requests(0).call();
    assert.equal("Buy Batteries", request.description);
  });
  it("Processes request", async () => {
    await Campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether")
    });
    await Campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: 1000000 });
    await Campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });
    await Campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 104);
  });
});
