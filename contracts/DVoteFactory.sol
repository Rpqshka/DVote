// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DVote.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Author: @Rpqshka
contract DVoteFactory is Ownable{
    address[] public deployedDVotes;
    address public voteAddress;
    event CreateDVote(DVote dvote);
    constructor(address _voteAddress){
        voteAddress = _voteAddress;
    }

    function createDVote(string memory _name,uint256 _startsAt, uint256 _endsAt) public onlyOwner{
        require(_startsAt < _endsAt,"Wrong time to vote");
        DVote newDVote = new DVote(_name,_startsAt, _endsAt, voteAddress);
        newDVote.transferOwnership(msg.sender);
        deployedDVotes.push(address(newDVote));
        emit CreateDVote(newDVote);
    }

    function changeVoteAddress(address newAddress) public onlyOwner{
        voteAddress = newAddress;
    }
    function returnDeployedDVotes() public view returns(address[] memory){
        return deployedDVotes;
    }
}