import { React, Component } from "react";
import dVoteFactory from "../scripts/export/contract/dvotefactory";
import {signer} from "../scripts/export/web3";
import {Button, Form, Message } from 'semantic-ui-react';
import Layout from "../scripts/export/layout/layout";
import 'semantic-ui-css/semantic.min.css'

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameDVote: '',
      start: 0,
      end: 0,
      voteAddress: '',
      errMsgCreate: '',
      errMsgChange: '',
      loadingCreate: false,
      loadingChange: false
    };
  };

  onCreate = async (event) => {
    event.preventDefault();
    this.setState({ loadingCreate: true, errMsgCreate: '' });
    try {
      await dVoteFactory.connect(signer).createDVote(this.state.nameDVote, this.state.start, this.state.end);
    }
    catch (err) {
      this.setState({ errMsgCreate: err.code });
    }
    this.setState({ loadingCreate: false });

  }

  onChangeAddress = async (event) => {
    event.preventDefault();
    this.setState({ loadingChange: true, errMsgChange: '' });
    try {
      await dVoteFactory.connect(signer).changeVoteAddress(this.state.voteAddress);
    }
    catch (err) {
      this.setState({ errMsgChange: err.code });
    }
    this.setState({ loadingChange: false });
  }

  render() {
    return (
      <Layout>
        <h1>DVote SECTION</h1>
        <Form onSubmit={this.onCreate} error={!!this.state.errMsgCreate}>
          <Form.Field>
            <label>DVote name</label>
            <input
              value={this.state.nameDVote}
              onChange={event => this.setState({ nameDVote: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Start time</label>
            <input
              value={this.state.start}
              onChange={event => this.setState({ start: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>End time</label>
            <input
              value={this.state.end}
              onChange={event => this.setState({ end: event.target.value })}
            />
          </Form.Field>
          <Message
            error
            header='Oops, something went wong.'
            content={this.state.errMsgCreate}
          />
          <Button style={{marginBottom: "15px"}} loading={this.state.loadingCreate} primary >Create DVote</Button>
        </Form>
        <Form onSubmit={this.onChangeAddress} error={!!this.state.errMsgChange}>
          <Form.Field>
            <label>New NFT address</label>
            <input
              value={this.state.voteAddress}
              onChange={event => this.setState({ voteAddress: event.target.value })}
            />
          </Form.Field>
          <Message
            error
            header='Oops, something went wong.'
            content={this.state.errMsgChange}
          />
          <Button loading={this.state.loadingChange} primary >Change address</Button>
        </Form>
      </Layout>
    );
  };
}

export default Admin;
