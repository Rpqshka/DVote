// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Candidate{
    uint256 public candidateId;
    string public description;
    uint256 public voteCount;
    
    constructor(uint256 _candidateId, string memory ipfsDescription){
        candidateId = _candidateId;
        description = ipfsDescription;
    }
}