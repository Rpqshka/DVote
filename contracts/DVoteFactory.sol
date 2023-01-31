// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DVote.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DVoteFactory is Ownable{
    address[] public deployedDVotes;

    function createDVote(uint256 _startsAt, uint256 _endsAt) public onlyOwner{
        address newDVote = address(new DVote(_startsAt, _endsAt));
        deployedDVotes.push(newDVote);
    }
    
}