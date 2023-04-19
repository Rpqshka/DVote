import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

import 'semantic-ui-css/semantic.min.css'

class Footer extends Component {
  render() {
    return (
      <Menu style={{
        justifyContent: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0
      }}>
        <Menu.Item style={{
          borderLeft: '1px solid #ccc',
          paddingLeft: '10px'
        }}>
          @rpqshka
        </Menu.Item>
        <Menu.Item>
          rpqshka@gmail.com
        </Menu.Item>
        <Menu.Item>
          GitHub
        </Menu.Item>
        <Menu.Item>
          LinkedIn
        </Menu.Item>
      </Menu>
    );
  };

}
export default Footer;