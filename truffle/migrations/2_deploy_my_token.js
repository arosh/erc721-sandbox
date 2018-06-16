const MyToken = artifacts.require('./MyToken.sol')
const fs = require('mz/fs');

module.exports = (deployer) => {
  deployer
    .deploy(MyToken, "MyToken", "MTKN")
    .then(() =>
      Promise.all([
        fs.writeFile('../contracts/address.txt', MyToken.address),
        fs.writeFile('../contracts/abi.json', JSON.stringify(MyToken.toJSON().abi)),
      ])
    );
}
