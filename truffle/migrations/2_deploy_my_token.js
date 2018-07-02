const MyToken = artifacts.require("./MyToken.sol");
const fs = require("mz/fs");

module.exports = deployer => {
  deployer.deploy(MyToken).then(() =>
    fs.writeFile(
      "../contract/MyToken.json",
      JSON.stringify({
        address: MyToken.address,
        abi: MyToken.toJSON().abi
      })
    )
  );
};
