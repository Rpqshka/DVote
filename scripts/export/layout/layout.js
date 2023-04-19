import React, { Component } from "react";
import Header from "./header";
import Footer from "./footer";
import { Container } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'

class Layout extends Component {
  render() {
    return (
      <Container>
        <Header />
        <div style={{ paddingBottom:'50px'}}>
          {this.props.children}
        </div>
        <Footer/>
      </Container >
    );
  };
};
export default Layout;