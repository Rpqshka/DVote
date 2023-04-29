<a id ='header'></a>
<h1 align="center">DVote</h1>

[DVote](#DVote) - application that allows for decintralized voting. Each user of the platform will be able to mint an NFT, giving him access to various votes and preventing ballot stuffing. Each user will also be able to view data about the vote and about each candidate.
___

<h2>Installation</h2>

Install Metamask and connect Sepolia network.
Run this command in cmd ```npm run dev```

___

<h2>Contracts</h2>

__Dvote.sol__
: A voting contract that allows you to interact with candidates

__DVoteFactory.sol__
: A factory that creates Dvote.sol contracts

__Vote.sol__
: ERC-721 contract that allows you to participate in voting

___

<h2>Tests</h2>

```npx hardhat test```

<details>
<summary>DVote</summary>

    ✔ Can create DVote contract from DVoteFactory
    ✔ Correct owner of the contract
    ✔ Can create candidate
    ✔ Only owner can create candidate
    ✔ Multiple candidates can be created
    ✔ Can edit candidate
    ✔ Only owner can edit candidate
    ✔ Can delete candidate
    ✔ Only owner can delete candidate
    ✔ Can vote for candidate
    ✔ Multiple users can vote for a candidate
    ✔ Can`t vote for candidate if you already voted
    ✔ Can`t vote for candidate without NFT
    ✔ Can`t vote for deleted candidate
    ✔ Getters are correct
    ✔ Can`t create a candidate if the time to vote has not yet come
    ✔ Can`t edit a candidate description if the time to vote has not yet come
    ✔ Can`t delete a candidate if the time to vote has not yet come
    ✔ Can`t vote for a candidate if the time to vote has not yet come

</details>

<details>
<summary>DVoteFactory</summary>

    ✔ Create DVoteFactory contract
    ✔ Vote address equal to Vote smart-contract address
    ✔ Correct contract owner
    ✔ Can create new DVote
    ✔ Correct new Dvote name
    ✔ Only owner can create new DVote
    ✔ Correct start time and end time for DVote
    ✔ Change Vote Address
    ✔ Only owner can change the address
    ✔ returnDeployedDVotes function correctly returns the value

</details>

<details>
<summary>Vote</summary>

    ✔ Create Vote NFT contract
    ✔ Correct NFT name and symbol
    ✔ Correct contract owner
    ✔ Mint NFT
    ✔ Can`t mint more than one NFT
    ✔ More than one person can mint NFT
    ✔ Burn NFT
    ✔ Can`t burn NFT if you are not owner
    ✔ Token URI is correct
    ✔ Check if erc-165 is supported

</details>

___

<h2>Coverage</h2>

```npx hardhat coverage```

File | % Stmts | % Branch | % Lines
:----|:--------|:---------|:---------:
 DVote.sol        |      100 |      100 |      100 |      100 |
 DVoteFactory.sol |      100 |      100 |      100 |      100 |
 Vote.sol         |      100 |    83.33 |      100 |      100 |
__All files__ | 100 | 94.44 | 100 | 100 |

___

<h2>Test app</h2>

Go to ```http://localhost:3000/``` and enjoy.

<a id ='DVote'></a>
#### Main page

[![index.png](https://i.postimg.cc/wMwrc23c/index.png)](https://postimg.cc/fS05MxcJ)

#### Mint page

[![mint.png](https://i.postimg.cc/MTFR7jqf/mint.png)](https://postimg.cc/VrXd1vSz)

#### Create vote page

[![create-vote.png](https://i.postimg.cc/G3W23LvV/create-vote.png)](https://postimg.cc/grKdNPSH)

#### Create candidate page

[![create-candidate.png](https://i.postimg.cc/pLqRjRn2/create-candidate.png)](https://postimg.cc/xXJwDrR7)

#### Vote page

[![vote.png](https://i.postimg.cc/FHgQ4mxy/vote.png)](https://postimg.cc/Bj6zTrkb)

[Go to the top of the page](#header)
