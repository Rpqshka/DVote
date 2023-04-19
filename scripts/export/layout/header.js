import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { Web3 } from "../web3";
import { Link } from "../../../routes"
import 'semantic-ui-css/semantic.min.css'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
    };
  };

  handleConnectWalletChange = (isConnected) => {
    this.setState({ isConnected });
  };

  render() {
    return (
      <Menu style={{ marginTop: '10px' }}>
        <Link route="/" className="item">
          DVote
        </Link>
        <Menu.Menu position="right">
          <Menu.Item>
            <Web3 onChange={this.handleConnectWalletChange} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  };

}
export default Header;