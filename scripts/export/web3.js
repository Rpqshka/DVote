import { React, Component } from 'react'
import { ethers } from 'ethers'
import { Button } from 'semantic-ui-react'
import dVoteFactory from './contract/dvotefactory';

let provider = null;
let signer = null;
let isAdmin = false;
class Web3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgWallet: 'Connect Wallet',
      isConnected: false,
      msgProvider: 'To use this dapp please download metamask',
      isInstalled: false
    };
  };

  async componentDidMount() {
    //Connect provider
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      this.setState({ msgProvider: 'Provider work good (delete this)', isInstalled: true })
    }
    else {
      provider = null;
      this.setState({ msgProvider: 'To use this dapp please download metamask', isInstalled: false })
    }
    //Connect Metamask
    if (provider) {
      try {
        signer = provider.getSigner();
        this.setState({ msgWallet: await signer.getAddress(), isConnected: true });
        this.props.onChange(true);
        this.checkAdmin();
      }
      catch (err) {
        signer = null;
        this.setState({ msgWallet: 'Connect Wallet', isConnected: false });
        this.props.onChange(false);
        this.checkAdmin();
      }
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length == 0) {
          this.setState({ msgWallet: 'Connect Wallet', isConnected: false });
          this.props.onChange(false);
          this.checkAdmin();

        } else {
          this.setState({ msgWallet: accounts[0], isConnected: true });
          this.props.onChange(true);
          this.checkAdmin();
        }
      });
    };
  }

  connect = async () => {

    if (provider) {
      signer = provider.getSigner();
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.setState({ msgWallet: await signer.getAddress() });
    }
    else {
      document.getElementsByClassName("wallet")[0].style.display = "none";
    }
  };

  async checkAdmin() {
    try {
      if (await signer.getAddress() == await dVoteFactory.connect(provider).owner()) {
        isAdmin = true;
      }
      else {
        isAdmin = false;

      }
    }
    catch (err) {
      isAdmin = false;
    }

    if (isAdmin) {
      for (let i = 0; i < document.getElementsByClassName("onlyAdmin").length; i++) {
        document.getElementsByClassName("onlyAdmin")[i].style.display = "block";
      }
    }
    else {
      for (let i = 0; i < document.getElementsByClassName("onlyAdmin").length; i++) {
        document.getElementsByClassName("onlyAdmin")[i].style.display = "none";
      }
    }
  }

  render() {
    return (
      <div>
        <Button className='wallet' onClick={() => this.connect()}>
          {this.state.msgWallet}
        </Button>
      </div>
    );
  };
};

export { Web3, signer, provider, isAdmin };