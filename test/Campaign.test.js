const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../Ethereum/build/FactoryCampaign.json");
const compiledCampaign = require("../Ethereum/build/Campaign.json");
