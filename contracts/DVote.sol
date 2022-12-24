// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Candidate.sol";

contract DVote is Ownable{
    using Counters for Counters.Counter;

    Counters.Counter public candidateId;
    mapping(uint256 => address) public candidateAddress;

    function createCandidate(string memory ipfsDescription) public onlyOwner{
        Candidate candidate = new Candidate(candidateId.current(), ipfsDescription);
        candidateAddress[candidateId.current()] = address(candidate);
        candidateId.increment();
    }
    function deleteCandidate(uint256 _candidateId) public onlyOwner{
        delete candidateAddress[_candidateId];
    }
}