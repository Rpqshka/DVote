// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Vote.sol";

// Author: @Rpqshka
contract DVote is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public candidateId;
    string public name;
    uint256 public startsAt;
    uint256 public endsAt;
    mapping(address => bool) public voters;
    Vote vote;

    struct Candidate {
        uint256 id;
        string firstName;
        string secondName;
        string description;
        uint256 voteCount;
        bool isDeleted;
    }

    Candidate[] candidates;
    Candidate candidate;

    event CreateCandidate(
        uint256 candidateId,
        string description,
        uint256 voteCount
    );
    event EditCandidate(uint256 candidateId, string description);
    event DeleteCandidate(uint256 candidateId);
    event AddVote(uint256 candidateId);

    constructor(
        string memory _name,
        uint256 _startsAt,
        uint256 _endsAt,
        address nftAddress
    ) {
        name = _name;
        vote = Vote(nftAddress);
        startsAt = block.timestamp + _startsAt;
        endsAt = block.timestamp + _endsAt;
    }

    function createCandidate(
        string memory firstName,
        string memory secondName,
        string memory _description
    ) public onlyOwner availableForVoting {
        candidate = Candidate(
            candidateId.current(),
            firstName,
            secondName,
            _description,
            0,
            false
        );
        candidates.push(candidate);
        emit CreateCandidate(candidateId.current(), _description, 0);
        candidateId.increment();
    }

    function editCandidateDescription(
        uint256 _candidateId,
        string memory _description
    ) public onlyOwner availableForVoting {
        candidates[_candidateId].description = _description;
    }

    function deleteCandidate(
        uint256 _candidateId
    ) public onlyOwner availableForVoting {
        candidates[_candidateId] = Candidate(0, "", "", "", 0, true);
        emit DeleteCandidate(_candidateId);
    }


    function voteForCandidate(uint256 _candidateId) public availableForVoting {
        require(voters[msg.sender] == false, "You already voted");
        require(vote.balanceOf(msg.sender) == 1, "You dont have NFT");
        require(
            candidates[_candidateId].isDeleted == false,
            "Candidate does not exist"
        );
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit AddVote(_candidateId);
    }

    function getCandidateById(uint256 index) public view returns (Candidate memory){
        return candidates[index];
    }

    function getCandidateInfo(
        uint256 _candidateId
    )
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        return (
            candidates[_candidateId].id,
            candidates[_candidateId].firstName,
            candidates[_candidateId].secondName,
            candidates[_candidateId].description,
            candidates[_candidateId].voteCount,
            candidates[_candidateId].isDeleted
        );
    }

    modifier availableForVoting() {
        require(block.timestamp > startsAt, "Voting has not started");
        require(block.timestamp < endsAt, "Voting is over");
        _;
    }
}
