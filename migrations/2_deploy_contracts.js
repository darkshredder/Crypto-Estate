var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RealEstate = artifacts.require("./RealEstate.sol");

module.exports = function (deployer) {
  // deployer.deploy(SimpleStorage);
  deployer.deploy(RealEstate);
};
