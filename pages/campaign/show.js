import React, { Component } from "react";
import { ethers } from "ethers";
import { provider, signer } from "../../scripts/export/web3";
import DVote from '../../artifacts/contracts/DVote.sol/DVote.json';
import Layout from "../../scripts/export/layout/layout";
import { Card, Button, Message, Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import { Router } from '../../routes'

let dVote;
class CampaignShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      description: '',
      candidateId: 0,
      loadingCreate: false,
      loadingVote: false,
      loadingEdit: false,
      loadingDelete: false,
      errMsgVote: '',
      errMsgEdit: '',
      errMsgDelete: ''
    };
  };
  async componentDidMount() {
    const candidates = await this.renderCandidates();
    this.setState({ candidates });
    document.getElementsByClassName("edit")[0].style.display = "none";
  }

  static async getInitialProps(props) {
    dVote = new ethers.Contract(props.query.address, DVote.abi, provider);
    return {
      campaignName: await dVote.connect(provider).name(),
      campaignStartsAt: await dVote.connect(provider).startsAt(),
      campaignEndsAt: await dVote.connect(provider).endsAt(),
      addressDVote: props.query.address
    };
  }

  async getCandidates() {
    const candidateCount = await dVote.connect(provider).candidateId();
    const candidatePromises = [];

    for (let i = 0; i < candidateCount; i++) {
      candidatePromises.push(dVote.connect(provider).getCandidateInfo(i));
    }
    const candidateResults = await Promise.all(candidatePromises);

    const candidates = candidateResults.map(result => ({
      id: result[0].toNumber(),
      firstName: result[1],
      secondName: result[2],
      description: result[3],
      voteCount: result[4].toNumber(),
      isDeleted: result[5]
    }));

    return candidates;
  }

  async renderCandidates() {
    const candidates = await this.getCandidates();
    const items = candidates.map((buff) => {
      let description = buff.description;
      if (description.length > 300) {
        description = description.substring(0, 300) + '...';
      }
      if (buff.isDeleted == false) {
        return {
          key: buff.id,
          header: buff.firstName + " " + buff.secondName,
          description: description,
          meta: buff.voteCount + " vote(s)",
          extra: (
            <div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                <Button primary onClick={() => this.onVote(buff.id)} disabled={this.state.loadingVote}>
                  {this.state.loadingVote ? 'Voting...' : 'Vote for candidate'}
                </Button>
                <p>{this.props.errMsgVote}</p>
              </div>
              <div className="onlyAdmin" style={{ display: "flex", justifyContent: "center" }}>
                <Button  onClick={() => this.editCandidate(buff.id)} disabled={this.state.loadingEdit}>
                  {this.state.loadingEdit ? 'Editing...' : 'Edit'}
                </Button>
                <p>{this.props.errMsgEdit}</p>
                <Button  onClick={() => this.deleteCandidate(buff.id)} disabled={this.state.loadingDelete}>
                  {this.state.loadingDelete ? 'Deleting...' : 'Delete'}
                </Button>
                <p>{this.props.errMsgDelete}</p>
              </div>
            </div>
          ),
        };
      }
      else {
        return {};
      }
    }).filter(item => Object.keys(item).length !== 0);

    const cards = items.map((item) => (
      <Card className="candidateCard" {...item} style={{ margin: 0, padding: 0 }} />
    ));
    return (
      <div style={{
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignContent: 'space-between',
        gap: '1em',
        margin: '1em 0'
      }}>
        {cards}
      </div>
    );
  }

  onVote = async (candidateId) => {
    document.getElementsByClassName("voteError")[0].style.display = "none";
    this.setState({ loadingVote: true, errMsgVote: '' });
    try {
      await dVote.connect(signer).voteForCandidate(candidateId);
      document.getElementsByClassName("voteError")[0].style.display = "none";
    }
    catch (err) {
      this.setState({ loadingVote: false, errMsgVote: err.code })
      document.getElementsByClassName("voteError")[0].style.display = "block";
    }
    this.setState({ loadingVote: false });
  }

  createCandidate() {
    Router.push(`${this.props.addressDVote}/add`);
  }
  editCandidate(_candidateId) {
    document.getElementsByClassName("edit")[0].style.display = "block";
    this.setState({ candidateId: _candidateId })
  }
  async deleteCandidate(_candidateId) {
    this.setState({ loadingDelete: true, errMsgDelete: '' });
    try {
      await dVote.connect(signer).deleteCandidate(this.state.candidateId);
    }
    catch (err) {
      this.setState({ loadingDelete: false, errMsgDelete: err.code })
    }
    this.setState({ loadingEdit: false });
  }
  onEdit = async () => {
    document.getElementsByClassName("voteError")[0].style.display = "none";
    this.setState({ loadingEdit: true, errMsgEdit: '' });
    try {
      await dVote.connect(signer).editCandidateDescription(this.state.candidateId, this.state.description);
      document.getElementsByClassName("voteError")[0].style.display = "none";
    }
    catch (err) {
      this.setState({ loadingEdit: false, errMsgEdit: err.code })
      document.getElementsByClassName("voteError")[0].style.display = "block";
    }
    this.setState({ loadingEdit: false });
    document.getElementsByClassName("edit")[0].style.display = "none";
  }
  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "15px" }}>
          <Button onClick={() => this.createCandidate()} className='onlyAdmin' primary>
            Create Candidate
          </Button>
        </div>
        {this.state.candidates}
        <Message className="voteError" style={{ display: 'flex', justifyContent: 'center', marginBottom: "15px", display: 'none', wordWrap: 'break-word' }}
          error
          header='Oops, something went wong.'
          content={this.state.errMsgVote}
        />
        <Form className="edit" onSubmit={this.onEdit} error={!!this.state.errMsgEdit}>
          <Form.Field>
            <label>New description</label>
            <input
              value={this.state.description}
              onChange={event => this.setState({ description: event.target.value })}
            />
          </Form.Field>
          <Button loading={this.state.loadingEdit} primary >Edit Candidate description</Button>
        </Form>
      </Layout>
    )
  }
}

export default CampaignShow;