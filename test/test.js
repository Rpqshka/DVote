const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers, BigNumber} = require("hardhat");

let owner, alice, bob;
let Vote, vote, DVoteFactory, dVoteFactory, dvote;
const URI = "ipfs://Qmdrp4WmCTsWyAw8sttxE8ebbaAUco4VyUhM1awxB5E4fj";

beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();

    Vote = await ethers.getContractFactory("Vote", owner.address);
    vote = await Vote.deploy()
    await vote.deployed();

    DVoteFactory = await ethers.getContractFactory("DVoteFactory", owner.address);
    dVoteFactory = await DVoteFactory.deploy(vote.address);
    await dVoteFactory.deployed();
});

describe("Vote.sol", () => {
    it("Create Vote NFT contract", () => {
        assert.ok(vote.address);
    });

    it("Correct NFT name and symbol", async () => {
        assert.equal(await vote.name(), "Vote");
        assert.equal(await vote.symbol(), "VOTE");
    })

    it("Correct contract owner", async () => {
        assert.equal(await vote.owner(), owner.address);
    });

    it("Mint NFT", async () => {
        await vote.connect(alice).safeMint(alice.address, URI);
        assert.equal(await vote.balanceOf(alice.address), 1);
    });

    it("Can`t mint more than one NFT", async () => {
        assert.equal(await vote.balanceOf(alice.address), 0);
        await vote.connect(alice).safeMint(alice.address, URI);
        try {
            await vote.connect(alice).safeMint(alice.address, URI);
        }
        catch (err) {
            assert.ok(true);
        }
        finally {
            assert.equal(await vote.balanceOf(alice.address), 1);
        }
    });

    it("More than one person can mint NFT", async () => {
        assert.equal(await vote.balanceOf(alice.address), 0);
        assert.equal(await vote.balanceOf(bob.address), 0);
        await vote.connect(alice).safeMint(alice.address, URI);
        await vote.connect(bob).safeMint(bob.address, URI);
        assert.equal(await vote.balanceOf(alice.address), 1);
        assert.equal(await vote.balanceOf(bob.address), 1);
    });

    it("Burn NFT", async () => {
        await vote.connect(alice).safeMint(alice.address, URI);
        assert.equal(await vote.balanceOf(alice.address), 1);
        assert.equal(await vote.idByAddress(alice.address), 0);
        await vote.connect(alice).burn(0);
        assert.equal(await vote.balanceOf(alice.address), 0);
    });

    it("Can`t burn NFT if you are not owner", async () =>{
        await vote.connect(alice).safeMint(alice.address, URI);
        assert.equal(await vote.balanceOf(alice.address), 1);
        assert.equal(await vote.idByAddress(alice.address), 0);
        await vote.connect(alice).approve(bob.address, 0);
        try{
            await vote.connect(bob).burn(0);
        }
        catch(err){
            assert.ok(true);
        }
        assert.equal(await vote.balanceOf(alice.address), 1);

    })

    it("Token URI is correct", async () => {
        await vote.connect(alice).safeMint(alice.address, URI);
        assert.equal(await vote.connect(owner).tokenURI(0), URI);
    });

    it("Check if erc-165 is supported", async () => {
        assert.equal(await vote.supportsInterface(0x80ac58cd), true);
    })

});

describe("DVoteFactory", () => {
    it("Create DVoteFactory contract", () => {
        assert.ok(dVoteFactory.address);
    });

    it("Vote address equal to Vote smart-contract address", async () => {
        assert.equal(await dVoteFactory.voteAddress(), vote.address);
    });

    it("Correct contract owner", async () => {
        assert.equal(await dVoteFactory.owner(), owner.address);
    });

    it("Can create new DVote", async () => {
        try {
            await dVoteFactory.deployedDVotes(0);
        }
        catch (err) {
            await dVoteFactory.connect(owner).createDVote("Test contract",0, 100000);
            assert.ok(await dVoteFactory.deployedDVotes(0));
        }
        try {
            await dVoteFactory.deployedDVotes(1);
        }
        catch (err) {
            assert.ok(true);
        }
    });
    it("Correct new Dvote name", async () =>{
        await dVoteFactory.connect(owner).createDVote("Test contract",0, 100000);
        const dvoteTest = await ethers.getContractAt("DVote", await dVoteFactory.connect(owner).deployedDVotes(0));
        assert.equal(await dvoteTest.name(), "Test contract");

    })

    it("Only owner can create new DVote", async () => {
        try {
            await dVoteFactory.connect(alice).createDVote("Test contract",0, 100000);
        }
        catch (err) {
            assert.ok(true);
        }
        try {
            await dVoteFactory.deployedDVotes(0);
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Correct start time and end time for DVote", async () => {
        try {
            await dVoteFactory.connect(owner).createDVote("Test contract",1000, 10);
        }
        catch (err) {
            assert.ok(true);
        }
    });


    it("Change Vote Address", async () => {
        await dVoteFactory.connect(owner).changeVoteAddress(alice.address);
        assert.equal(await dVoteFactory.voteAddress(), alice.address);
    });

    it("Only owner can change the address", async () => {
        try {
            await dVoteFactory.connect(bob).changeVoteAddress(alice.address);
        }
        catch (err) {
            assert.ok(true);
        }
    });
    it("returnDeployedDVotes function correctly returns the value", async () =>{
        const emptyArr = await dVoteFactory.connect(owner).returnDeployedDVotes();
        assert.equal(emptyArr.length, 0);
        await dVoteFactory.connect(owner).createDVote("Test contract1",0, 100000);
        await dVoteFactory.connect(owner).createDVote("Test contract2",0, 100000);
        const filledArr = await dVoteFactory.connect(owner).returnDeployedDVotes();
        assert.equal(filledArr.length, 2);

    });
});

describe("DVote", () => {
    beforeEach(async () => {
        await dVoteFactory.connect(owner).createDVote("Test contract",0, 1000000);
        dvote = await ethers.getContractAt("DVote", await dVoteFactory.connect(owner).deployedDVotes(0));

        await dVoteFactory.connect(owner).createDVote("Test contract",100000, 1000000000000);
        dvoteStart = await ethers.getContractAt("DVote", await dVoteFactory.connect(owner).deployedDVotes(1));

        await dVoteFactory.connect(owner).createDVote("Test contract",0, 1000);
        dvoteEnd = await ethers.getContractAt("DVote", await dVoteFactory.connect(owner).deployedDVotes(2));
    });

    it("Can create DVote contract from DVoteFactory", async () => {
        assert.equal(dvote.address, await dVoteFactory.connect(owner).deployedDVotes(0));
    });

    it("Correct owner of the contract", async () => {
        assert.equal(await dvote.owner(), owner.address);
    });

    it("Can create candidate", async () => {
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        const candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        const firstName = candidateInfo[1];
        assert.equal(firstName, "Alex");
    });

    it("Only owner can create candidate", async () => {
        try {
            await dvote.connect(alice).createCandidate("Alex", "Golikov", "test");
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Multiple candidates can be created", async () => {
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        await dvote.connect(owner).createCandidate("Jon", "Snow", "test1");
        await dvote.connect(owner).createCandidate("Elon", "Musk", "test2");
        const candidateInfoAlex = await dvote.connect(owner).getCandidateInfo(0);
        const firstNameAlex = candidateInfoAlex[1];
        const candidateInfoJon = await dvote.connect(owner).getCandidateInfo(1);
        const firstNameJon = candidateInfoJon[1];
        const candidateInfoElon = await dvote.connect(owner).getCandidateInfo(2);
        const firstNameElon = candidateInfoElon[1];
        assert.equal(firstNameAlex, "Alex");
        assert.equal(firstNameJon, "Jon");
        assert.equal(firstNameElon, "Elon");
    });

    it("Can edit candidate", async () => {
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        let candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        let description = candidateInfo[3];
        assert.equal(description, "test");
        await dvote.connect(owner).editCandidateDescription(0, "description");
        candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        description = candidateInfo[3];
        assert.equal(description, "description");
    });

    it("Only owner can edit candidate", async () => {
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        let candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        let description = candidateInfo[3];
        assert.equal(description, "test");
        try {
            await dvote.connect(alice).editCandidateDescription(0, "description");
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Can delete candidate", async () => {
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        let candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        let description = candidateInfo[3];
        assert.equal(description, "test");
        await dvote.connect(owner).deleteCandidate(0);
        let candidateInfoDeleted = await dvote.connect(owner).getCandidateInfo(0);
        let isDeleted = candidateInfoDeleted[5];
        assert.equal(isDeleted, true);
    });

    it("Only owner can delete candidate", async () => {
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        let candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        let description = candidateInfo[3];
        assert.equal(description, "test");
        try {
            await dvote.connect(alice).deleteCandidate(0);
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Can vote for candidate", async () => {
        await vote.connect(alice).safeMint(alice.address, URI);
        assert.equal(await vote.balanceOf(alice.address), 1);
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        await dvote.connect(alice).voteForCandidate(0);
        assert.equal(await dvote.voters(alice.address), true);
        let candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        let voteCount = candidateInfo[4];
        assert.equal(voteCount, 1);
    });

    it("Multiple users can vote for a candidate", async () => {
        await vote.connect(alice).safeMint(alice.address, URI);
        await vote.connect(bob).safeMint(bob.address, URI);
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        await dvote.connect(alice).voteForCandidate(0);
        await dvote.connect(bob).voteForCandidate(0);
        assert.equal(await dvote.voters(alice.address), true);
        assert.equal(await dvote.voters(bob.address), true);
        let candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        let voteCount = candidateInfo[4];
        assert.equal(voteCount, 2);
    });

    it("Can`t vote for candidate if you already voted", async () => {
        await vote.connect(alice).safeMint(alice.address, URI);
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        await dvote.connect(alice).voteForCandidate(0);
        try {
            await dvote.connect(alice).voteForCandidate(0);
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Can`t vote for candidate without NFT", async () => {
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        try {
            await dvote.connect(alice).voteForCandidate(0);
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Cant vote for deleted candidate", async () => {
        await vote.connect(alice).safeMint(alice.address, URI);
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        await dvote.connect(owner).deleteCandidate(0);
        assert.notEqual(await dvote.getCandidateById(0).description, "test");
        try {
            await dvote.connect(alice).voteForCandidate(0);
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Getters are correct", async () => {
        await dvote.connect(owner).createCandidate("Alex", "Golikov", "test");
        let candidateInfo = await dvote.connect(owner).getCandidateInfo(0);
        let firstName = candidateInfo[1];
        let secondName = candidateInfo[2];
        let description = candidateInfo[3];
        let voteCount = candidateInfo[4];
        let isDeleted = candidateInfo[5];
        assert.equal(firstName, "Alex");
        assert.equal(secondName, "Golikov");
        assert.equal(description, "test");
        assert.equal(voteCount, 0);
        assert.equal(isDeleted, false);
    });

    it("Can`t create a candidate if the time to vote has not yet come", async () => {
        assert.ok(await dvoteStart.address);
        assert.ok(await dvoteEnd.address);

        try {
            await dvoteStart.connect(owner).createCandidate("Alex", "Golikov", "test");
        }
        catch (err) {
            assert.ok(true);
        }

        await time.increase(10000);
        try {
            await dvoteEnd.connect(owner).createCandidate("Alex", "Golikov", "test");
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Can`t edit a candidate description if the time to vote has not yet come", async () => {
        assert.ok(await dvoteStart.address);
        assert.ok(await dvoteEnd.address);

        try {
            await dvoteStart.connect(owner).editCandidateDescription(0, "description");
        }
        catch (err) {
            assert.ok(true);
        }

        await time.increase(10000);
        try {
            await dvoteEnd.connect(owner).editCandidateDescription(0, "description");
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Can`t delete a candidate if the time to vote has not yet come", async () => {
        assert.ok(await dvoteStart.address);
        assert.ok(await dvoteEnd.address);

        try {
            await dvoteStart.connect(owner).deleteCandidate(0);
        }
        catch (err) {
            assert.ok(true);
        }

        await time.increase(10000);
        try {
            await dvoteEnd.connect(owner).deleteCandidate(0);
        }
        catch (err) {
            assert.ok(true);
        }
    });

    it("Can`t vote for a candidate if the time to vote has not yet come", async () => {
        await vote.connect(alice).safeMint(alice.address, URI);

        assert.ok(await dvoteStart.address);
        assert.ok(await dvoteEnd.address);

        try {
            await dvoteStart.connect(alice).voteForCandidate(0);
        }
        catch (err) {
            assert.ok(true);
        }

        await time.increase(10000);
        try {
            await dvoteEnd.connect(alice).voteForCandidate(0);
        }
        catch (err) {
            assert.ok(true);
        }
    });
});