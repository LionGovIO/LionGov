import React, { useEffect } from 'react'
import { Header } from '../../components/header/Header'
import { HomeContainer } from './Home.styles'
import { init } from './init'

export function Home() {
  useEffect(() => {
    init()
  })

  return (
    <>
      <Header />
      <HomeContainer>
        <div>
          LionGov is open source! Github repo:{' '}
          <a href="https://github.com/LionGovIO/LionGov">
            https://github.com/LionGovIO/LionGov
          </a>
        </div>

        <br />

        <div>
          <h4>Submit Proposal</h4>

          <div>
            Note: This creates a proposal with "Yes" or "No" as the options.
            More proposal types will be supported in the future.
          </div>
        </div>
        <form id="proposal_form">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Title</label>
            <input
              type="text"
              className="form-control"
              id="proposal_title_input"
              aria-describedby="emailHelp"
              placeholder=""
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Description</label>
            <input
              type="text"
              className="form-control"
              id="proposal_description_input"
              placeholder=""
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <br />

        <div>
          <h4>View Proposals</h4>
          <div>
            Note: This list may be truncated, need to support viewing of all
            proposal. Also, ideally should make the proposal ID more human
            friendly.
          </div>

          <div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Proposal ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody id="proposals_table_tbody"></tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <hr />
        </div>

        <h4>Proposal</h4>

        <div className="lead" style={{ marginTop: '20px' }}>
          <b id="single_proposal_title">
            The Ultimate Question of the Multiverse
          </b>
        </div>

        <div className="lead">
          <div id="single_proposal_description">
            This is your last chance. After this, there is no turning back. You
            take the blue pill—the story ends, you wake up in your bed and
            believe whatever you want to believe. You take the red pill—you stay
            in Wonderland, and I show you how deep the rabbit hole goes.
            Remember: all I'm offering is the truth. Nothing more.
            <div>
              Choose your option, Yes for{' '}
              <span style={{ color: 'blue' }}>Blue pill</span>, No for{' '}
              <span style={{ color: 'red' }}>Red pill</span>:
            </div>
          </div>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="voteOptions"
            id="flexRadioDefault1"
            value="Yes"
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            <span>Yes</span>
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="voteOptions"
            id="flexRadioDefault2"
            value="No"
          />
          <label className="form-check-label" htmlFor="flexRadioDefault2">
            <span>No</span>
          </label>
        </div>
        <div>
          <button type="button" id="voteButton" className="btn btn-primary">
            Vote
          </button>
        </div>

        <br />

        <h4>Your Stats</h4>

        <div>
          <div>
            <i>MM balance:</i> <span id="mm_balance_num">N/A</span>
          </div>
          <div>
            <i>Vote weight (in points):</i>{' '}
            <span id="vote_weight_num">N/A</span>
          </div>
        </div>

        <div>
          <div>
            <i>[TODO: show what vote you made]</i>
          </div>
        </div>

        <br />

        <h4>Voting Stats</h4>

        <div>
          <i>Total vote count:</i> <span id="total_vote_count_num"></span>
        </div>

        <br />

        <h4>Recent Votes</h4>
        <div>
          <table className="table table-sm">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Wallet</th>
                <th scope="col">Vote</th>
                <th scope="col">Weight (in points)</th>
              </tr>
            </thead>
            <tbody id="votes_table_tbody"></tbody>
          </table>
        </div>
      </HomeContainer>
    </>
  )
}
