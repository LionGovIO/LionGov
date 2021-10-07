import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
//import { ProposalComp } from '../proposals/ProposalComp'
import { BASE_URL } from '../../shared/urls.js'
//import { BrowserRouter as Link, useParams } from 'react-router-dom'


function getVotesTable(currentVoteClass, setList) {

  let xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      let result = JSON.parse(xhttp.responseText)

      let items = result.items

      if (items) {
        setList(items);
      }

    }
  }
  xhttp.open(
    'GET',
    BASE_URL + '/privacyvotequery?voteClass=' + currentVoteClass,
    true
  )
  xhttp.send()
}


export function Proposal() {
  let { ProposalId } = useParams();


  useEffect(() => {
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        let proposal = JSON.parse(xhttp.responseText)

        setProposal(proposal)

        getVotesTable(ProposalId, setList)

      }
    }

    xhttp.open('GET', BASE_URL + '/singleproposalquery?proposal='+encodeURI(ProposalId), true)
    xhttp.send()
  }, [])


  const [proposal, setProposal] = React.useState({})
  const [list, setList] = React.useState([])

  return (
    <div className="container-xl">
      <Link to="/">Home</Link>
      <div className="position-relative mb-3">
        <div className="row g-3 justify-content-between">
          <div className="col-auto">
            <h1 className="app-page-title mb-0">Proposal</h1>
          </div>
        </div>
      </div>

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
              <h4 className="notification-title mb-1">{proposal.Title}</h4>
              <ul className="notification-meta list-inline mb-0">
                <li className="list-inline-item">{(new Date(parseInt(proposal.CreationTime))).toLocaleString()}</li>
                <li className="list-inline-item">|</li>
                <li className="list-inline-item">{proposal.WalletAddress}</li>
              </ul>
            </div>
            {/*//col*/}
          </div>
          {/*//row*/}
        </div>
        {/*//app-card-header*/}
        <div className="app-card-body p-4">
          <div className="notification-content">
            {proposal.Description}
          </div>
        </div>
        {/*//app-card-body*/}
        <div className="app-card-footer px-4 py-3">

        </div>
      </div>


      <div className="app-card app-card-orders-table shadow-sm mb-5">
        <div className="app-card-body">
          <div className="table-responsive">
            <table className="table app-table-hover mb-0 text-left">
              <thead>
                <tr>
                  <th className="cell">Wallet</th>
                  <th className="cell">Vote</th>
                  <th className="cell">Weight</th>
                  <th className="cell">Date</th>
                </tr>
              </thead>
              <tbody>
                { list.map((item) => (
                  <tr key={Math.random()}>
                    <td className="cell">{item.obscuredWalletAddress}</td>
                    <td className="cell">{item.voteValue}</td>
                    <td className="cell">{item.voteWeight}</td>
                    <td className="cell">
                      <span>{(new Date(parseInt(item.creationTime))).toLocaleDateString()}</span>
                      <span className="note">{(new Date(parseInt(item.creationTime))).toLocaleTimeString()}</span>
                    </td>
                  </tr>
                )) }
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
