// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DVote.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DVoteFactory is Ownable{
    address[] public deployedDVotes;

    function createDVote() public onlyOwner{
        address newDVote = address(new DVote());
        deployedDVotes.push(newDVote);
    }
    
}