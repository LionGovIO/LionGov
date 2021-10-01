import React from 'react'
import {Input, Textarea} from '../../../shared/styles'
import { SubmitProposalContainer, Heading } from './SubmitProposal.styles'

export function SubmitProposal() {
  return (
    <SubmitProposalContainer>
      <div>
        <Heading>Submit Proposal</Heading>
        <div>
          Note: This creates a proposal with "Yes" or "No" as the options. More
          proposal types will be supported in the future.
        </div>
      </div>
      <form id="proposal_form">
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Title</label>
          <Input
            style={{ maxWidth: "300px" }}
            type="text"
            id="proposal_title_input"
            aria-describedby="emailHelp"
            placeholder=""
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Description</label>
          <Textarea
            type="text"
            id="proposal_description_input"
            placeholder=""
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </SubmitProposalContainer>
  )
}
