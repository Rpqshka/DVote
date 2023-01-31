const assert = require('assert');
const {ethers} = require('hardhat'); 

let Contract;
let contract;
//wallets
let owner, alice, bob;
describe("DVoteFactory", () => {
    beforeEach(async () => {
        [owner] = await ethers.getSigners();
        Contract = await ethers.getContractFactory("DVoteFactory", owner);
        contract = await Contract.deploy();
    });
    it("create DVoteFactory contract", () => {
        assert.ok(contract.address);
    });
    it("the owner of the contract is correct", () =>{
        console.log(contract.owner());
        console.log(owner);
        assert.equal(contract.owner().toString(), owner.toString());
    });

    it("DVoteFactory can create a new DVote contract", async () =>{
        await contract.createDVote(0, 1000);
        console.log(contract.deployedDVotes);
        assert.equal(contract.deployedDVotes.length, 1);
    });

});

/*
describe("DVote", () => {
});
*/