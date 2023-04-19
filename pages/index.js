import { React, Component } from "react";
import { ethers } from "ethers";
import dVoteFactory from "../scripts/export/contract/dvotefactory";
import DVote from '../artifacts/contracts/DVote.sol/DVote.json';
import { provider } from "../scripts/export/web3";
import { Card, Button} from 'semantic-ui-react';
import Layout from "../scripts/export/layout/layout";
import { Router, Link } from "../routes";
import 'semantic-ui-css/semantic.min.css';

class DVoteIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deployedDVotesArr: [],
      names: [],
    };
  };

  async componentDidMount() {
    this.setState({ deployedDVotesArr: await dVoteFactory.connect(provider).returnDeployedDVotes() });
  };

  async getDVotesName(address) {
    const dVote = new ethers.Contract(address, DVote.abi, provider);
    return new Promise((resolve, reject) => {
      dVote.connect(provider).name().then(resolve).catch(reject);
    });
  }

  renderDVotes() {
    const items = this.state.deployedDVotesArr.map((address, index) => {
      this.getDVotesName(address).then(name => {
        const names = [...this.state.names];
        names[index] = name;
        this.setState({ names });
      });
      return {
        key: index,
        header: this.state.names[index],
        description: (
          <Link route={`/campaign/${address}`}>View DVote</Link>
        ),
        meta: (
          <div style={{ overflowWrap: 'break-word' }}>
            {address}
          </div>)
      }
    });

    const cards = items.map((item) => (
      <Card className="candidateCard" {...item} style={{ margin: 0, padding: 0, flex: 1 }} />
    ));
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1em',
        margin: '1em 0'
      }}>
        {cards}
      </div>
    );
  }

  createDVote(){
    Router.push('/admin');
  }
  mintNft(){
    Router.push('/mint');
  }


  render() {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "15px" }}>
          <Button className="onlyAdmin" content='Create DVote' icon='plus' primary onClick={() => this.createDVote()}/>
          <Button className="owner" content='Mint NFT' icon='plus' primary onClick={() => this.mintNft()}/>
        </div>
        <div>{this.renderDVotes()}</div>
      </Layout>
    );
  };
}

export default DVoteIndex;
