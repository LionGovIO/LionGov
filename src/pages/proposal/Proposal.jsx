import React, { useEffect } from 'react'
import { BrowserRouter as Link, useParams } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
//import { ProposalComp } from '../proposals/ProposalComp'
import { BASE_URL } from '../../shared/urls.js'
//import { BrowserRouter as Link, useParams } from 'react-router-dom'

function getProposal(currentVoteClass) {
    // clear recent votes table
    // $('#votes_table_tbody').html('');

    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText)
        // Typical action to be performed when the document is ready:
        // document.getElementById("demo").innerHTML = xhttp.responseText;

        result = JSON.parse(xhttp.responseText)

        console.log(result)

      }
    }

    // var currentVoteClass = 'matrix'
    xhttp.open(
      "GET",
      BASE_URL + "/singleproposalquery?proposal=" + currentVoteClass,
      true
    )
    xhttp.send()
}



export function Proposal() {
  let { ProposalId } = useParams();

console.log("ProposalId!!!!!!!!!!!!!!!");

  console.log(ProposalId);

  useEffect(() => {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText)
        // Typical action to be performed when the document is ready:
        // document.getElementById("demo").innerHTML = xhttp.responseText;

        var proposal = JSON.parse(xhttp.responseText)


console.log("proposal!!!!!!!!!!!!!!!1");

console.log(proposal);

        //setProposal(proposal)

      //  getVoteStats(currentVoteClass)

      }
    }
    console.log("proposal id:"+ ProposalId);
    xhttp.open('GET', BASE_URL + '/singleproposalquery?proposal='+encodeURI(ProposalId), true)
    xhttp.send()
  }, [])


//  const [proposal, setProposal] = React.useState({});
  //const [list, setList] = React.useState([])

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
              <h4 className="notification-title mb-1">{proposal.title}</h4>
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
          <a className="action-link" href="#">
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
          </a>
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
                <tr>

                  { /*votes.map((vote) => (
                    <td className="cell">#15346</td>
                    <td className="cell">aaaa</td>
                    <td className="cell">John Sanders</td>
                    <td className="cell"><span>17 Oct</span><span className="note">2:16 PM</span></td>

                    <ProposalComp key={vote.proposalId} proposal={item} />
                  )) */}

                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
