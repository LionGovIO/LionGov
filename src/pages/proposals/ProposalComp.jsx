import React from 'react';
import { receipt } from '../../assets/svg/receipt'
import { Link } from 'react-router-dom'

export const ProposalComp = ({ proposal }) => (
  <div className="app-card app-card-notification shadow-sm mb-4">
    <div className="app-card-header px-4 py-3">
      <div className="row g-3 align-items-center">
        <div className="col-12 col-lg-auto text-center text-lg-start">
          <div className="app-icon-holder">{receipt}</div>
        </div>
        {/*//col*/}
        <div className="col-12 col-lg-auto text-center text-lg-start">
          <div className="notification-type mb-2">
            <span className="badge bg-info">Proposal</span>
          </div>
          <Link className="action-link" to={'/proposal/' + proposal.proposalId}><h4 className="notification-title mb-1">{proposal.title}</h4></Link>
          <ul className="notification-meta list-inline mb-0">
            <li className="list-inline-item">{(new Date(parseInt(proposal.creationTime))).toLocaleString()}</li>
            <li className="list-inline-item">|</li>
            <li className="list-inline-item">0x689741g5io</li>
          </ul>
        </div>
        {/*//col*/}
      </div>
      {/*//row*/}
    </div>
    {/*//app-card-header*/}
    <div className="app-card-body p-4">
      <div className="notification-content">
        {proposal.description}
      </div>
    </div>
    {/*//app-card-body*/}
    <div className="app-card-footer px-4 py-3">
      <Link className="action-link" to={'/proposal/' + proposal.proposalId}>
        Vote!
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          className="bi bi-arrow-right ms-2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
          />
        </svg>
      </Link>
    </div>
  </div>
)
