// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Candidate.sol";

contract DVote is Ownable{
    using Counters for Counters.Counter;

    Counters.Counter public candidateId;
    uint256 public startsAt;
    uint256 public endsAt;
    mapping(uint256 => address) public candidateAddress;
    address[] public _test;

    constructor(uint256 _startsAt, uint256 _endsAt){
        startsAt = block.timestamp + _startsAt;
        endsAt = block.timestamp + _endsAt;
    }

    function createCandidate(string memory ipfsDescription) public onlyOwner{
        Candidate candidate = new Candidate(candidateId.current(), ipfsDescription);
        candidateAddress[candidateId.current()] = address(candidate);
        candidateId.increment();
    }
    function deleteCandidate(uint256 _candidateId) public onlyOwner{
        delete candidateAddress[_candidateId];
    }
}