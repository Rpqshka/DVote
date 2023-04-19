import React, { Component } from "react";
import { ethers } from "ethers";
import { provider, signer } from "../../scripts/export/web3";
import DVote from '../../artifacts/contracts/DVote.sol/DVote.json';
import Layout from "../../scripts/export/layout/layout";
import 'semantic-ui-css/semantic.min.css'
import { Button, Form, Message } from 'semantic-ui-react';

let dVote
class Candidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      secondName: '',
      description: '',
      errMsgCreate: '',
      loadingCreate: false,
      loadingChange: false
    };
  };
  async componentDidMount() {
    dVote = new ethers.Contract(this.props.addressDVote, DVote.abi, provider);
  };
  static async getInitialProps(props) {
    return { addressDVote: props.query.address };
  };
  onCreate = async (event) => {
    document.getElementsByClassName("candidateError")[0].style.display = "none";
    event.preventDefault();
    this.setState({ loadingCreate: true, errMsgCreate: '' });
    try {
      await dVote.connect(signer).createCandidate(this.state.firstName, this.state.secondName, this.state.description);
      document.getElementsByClassName("candidateError")[0].style.display = "none";
    }
    catch (err) {
      this.setState({ errMsgCreate: err.code });
      document.getElementsByClassName("candidateError")[0].style.display = "block";
    }
    this.setState({ loadingCreate: false });
  }
  render() {
    return (
      <Layout>
        <h3>Create Candidate</h3>
        <Form onSubmit={this.onCreate} error={!!this.state.errMsgCreate}>
          <Form.Field>
            <label>First name</label>
            <input
              value={this.state.firstName}
              onChange={event => this.setState({ firstName: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Second Name</label>
            <input
              value={this.state.secondName}
              onChange={event => this.setState({ secondName: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              value={this.state.description}
              onChange={event => this.setState({ description: event.target.value })}
            />
          </Form.Field>
          <Message className="candidateError"
            error
            header='Oops, something went wong.'
            content={this.state.errMsgCreate}
          />
          <Button loading={this.state.loadingCreate} primary >Create Candidate</Button>
        </Form>
      </Layout>
    )
  }
}

export default Candidate;