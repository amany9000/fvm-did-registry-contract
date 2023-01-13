
const fvmDidRegistry = artifacts.require("FvmDidRegistry");

module.exports = async function (deployer) {
  const instance = await deployer.deploy(fvmDidRegistry);
};