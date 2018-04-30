pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract MyToken is ERC721Token {
  constructor(string _name, string _symbol) public ERC721Token(_name, _symbol) {}

  function mint() external {
    uint256 tokenId = totalSupply();
    super._mint(msg.sender, tokenId);
  }

  function setTokenURI(uint256 _tokenId, string _message) external onlyOwnerOf(_tokenId) {
    super._setTokenURI(_tokenId, _message);
  }

  function burn(uint256 _tokenId) external onlyOwnerOf(_tokenId) {
    super._burn(msg.sender, _tokenId);
  }
}
