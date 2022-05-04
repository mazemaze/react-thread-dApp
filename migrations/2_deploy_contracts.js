var ThreaderBase = artifacts.require("./ThreaderBase.sol");

module.exports = function(deployer) {
  deployer.deploy(ThreaderBase, 100000);
};
