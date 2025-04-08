const CrossBorderTransaction = artifacts.require('CrossBorderTransaction');

module.exports = function (deployer) {
  deployer.deploy(CrossBorderTransaction);
};
