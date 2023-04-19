import { React, Component } from "react";
import vote from "../scripts/export/contract/vote";
import { provider, signer } from "../scripts/export/web3";
import Layout from "../scripts/export/layout/layout";
import { Button, Container, Message } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import voteImage from "../images/vote.png";
import Image from 'next/image'

const URI = 'https://ipfs.filebase.io/ipfs/Qmdrp4WmCTsWyAw8sttxE8ebbaAUco4VyUhM1awxB5E4fj';

class Mint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: '',
      errMint: false,
      loadingMint: false,
      loadingBurn: false
    };
  };

  async mintVote() {
    document.getElementsByClassName("mintError")[0].style.display = "none";
    this.setState({ loadingMint: true, errMsg: '' });
    try {
      await vote.connect(signer).safeMint(signer.getAddress(), URI);
      document.getElementsByClassName("mintError")[0].style.display = "none";
    }
    catch (err) {
      this.setState({ errMsg: err.message });
      document.getElementsByClassName("mintError")[0].style.display = "block";
    }
    this.setState({ loadingMint: false });
  }
  async burnVote() {
    document.getElementsByClassName("mintError")[0].style.display = "none";
    this.setState({ loadingBurn: true, errMsg: '' });
    try {
      const id = await vote.connect(provider).idByAddress(signer.getAddress());
      await vote.connect(signer).burn(id);
      document.getElementsByClassName("mintError")[0].style.display = "none";
    }
    catch (err) {
      this.setState({ errMsg: err.message });
      document.getElementsByClassName("mintError")[0].style.display = "block";
    }
    this.setState({ loadingBurn: false });
  }
  render() {
    return (
      <Layout>
        <Container >
          <h2 style={{ display: 'flex', justifyContent: 'center', marginBottom: "15px" }}>
            To vote, you need a special NFT, which can be  minted from the button below
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: "15px" }}>
            <Image
              src={voteImage}
              alt="Vote NFT image"
              width={600}
              height={400} />
          </div>
        </Container>
        <Container style={{ display: 'flex', justifyContent: 'center', marginBottom: "15px" }}>
          <Button loading={this.state.loadingMint} onClick={() => this.mintVote()}>
            Mint Button
          </Button>
          <Button loading={this.state.loadingBurn} onClick={() => this.burnVote()}>
            Burn button
          </Button>
        </Container>
        <Message className="mintError" style={{ display: 'flex', justifyContent: 'center', marginBottom: "15px", display: 'none', wordWrap: 'break-word' }}
          error
          header='Oops, something went wong.'
          content={this.state.errMsg}
        />
      </Layout  >
    );
  };
}

export default Mint;
