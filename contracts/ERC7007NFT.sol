// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC7007NFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // AI Agent parameters
    struct AIParameters {
        string prompt;
        string model;
        uint256 timestamp;
        string twitterInteraction;
    }

    mapping(uint256 => AIParameters) public tokenAIParams;

    constructor() ERC721("AI Generated NFT", "AINFT") Ownable(msg.sender) {}

    function mintNFT(
        address recipient,
        string memory prompt,
        string memory model,
        string memory twitterInteraction
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(recipient, newTokenId);
        
        tokenAIParams[newTokenId] = AIParameters({
            prompt: prompt,
            model: model,
            timestamp: block.timestamp,
            twitterInteraction: twitterInteraction
        });

        return newTokenId;
    }

    function getAIParameters(uint256 tokenId) public view returns (
        string memory prompt,
        string memory model,
        uint256 timestamp,
        string memory twitterInteraction
    ) {
        AIParameters memory params = tokenAIParams[tokenId];
        return (
            params.prompt,
            params.model,
            params.timestamp,
            params.twitterInteraction
        );
    }
}