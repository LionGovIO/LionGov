import React from 'react'
import {Input, Textarea} from '../../shared/styles'
import { SubmitProposalContainer, Heading } from './SubmitProposal.styles'

export function SubmitProposal() {
  return (
    <div className="container-xl">
      <div>
    <SubmitProposalContainer className="app-card shadow-sm">
      <div>
        <Heading>Submit Proposal</Heading>
        <div>
          Note: This creates a proposal with "Yes" or "No" as the options. More
          proposal types will be supported in the future.
        </div>
      </div>
      <form id="proposal_form" className="">
        <div className="form-group mb-3">
          <label htmlFor="proposal_title_input" className="form-label">Title</label>
          <Input
            type="text"
            id="proposal_title_input"
            placeholder=""
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="proposal_description_input" className="form-label">Description</label>
          <Textarea
            style={{ "min-height": "150px" }}
            type="text"
            id="proposal_description_input"
            placeholder=""
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </SubmitProposalContainer>
    </div>
  </div>
  )
}
