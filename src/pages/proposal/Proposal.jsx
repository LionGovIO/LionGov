import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
import { useForm } from "react-hook-form"
//import { ProposalComp } from '../proposals/ProposalComp'
import { BASE_URL } from '../../shared/urls.js'
//import { BrowserRouter as Link, useParams } from 'react-router-dom'


function getVotesTable(proposal, currentVoteClass, setList) {

  let xhttp = new XMLHttpRequest()
  xhttp.responseType = 'json';
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      let result = xhttp.response

      let votes = result.items

      if (votes) {
        setList(votes);
      }

      console.log(result);

      // TODO: for now, assume 'Yes' and 'No' are the vote values
      //let option = {};
      let option_Weight = {};
      let totalWeight = 0;



      let chart_data = null;

      let option_labels = null;

      if(proposal.ProposalType == 'yes_no'){
        option_Weight['yes'] = 0;
        option_Weight['no'] = 0;

        for (const i in votes) {
          option_Weight[votes[i].voteValue.toLowerCase()] += Number(votes[i].voteWeight);
          totalWeight += Number(votes[i].voteWeight);
        }
        option_labels = ['No', 'Yes'];
        chart_data = [option_Weight['no'], option_Weight['yes']];
      }
      else {
        option_Weight = Array(proposal.Options.length).fill(0);

        for (const i in votes) {
          option_Weight[votes[i].voteValue] += Number(votes[i].voteWeight);
          totalWeight += Number(votes[i].voteWeight);
        }
        option_labels = proposal.Options;
        chart_data = option_Weight;
      }

      //let sum = result.sum;
      let count = votes.length;

      // Add pie chart

      if (window.myChart instanceof Chart) {
          window.myChart.destroy();
      }

      let ctx = document.getElementById('myChart').getContext('2d');

      window.myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: option_labels,
          datasets: [{
            label: '# of Votes',
            data: chart_data,
            backgroundColor: [
              '#ff6484',
              '#36a2eb',
              '#026e00',
              '#ecdb54'
            ]
          }]
        },
        options: {
          plugins: {
            title: {
              //display: true,
              //text: 'Total Vote Weight'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
        // responsive: true,
        // maintainAspectRatio: false
      });


      var totalVoteCount = count;
    //  document.getElementById('total_vote_count_num').text(totalVoteCount);

      //document.getElementById('total_vote_weight_num').text(totalWeight);

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
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => {

    console.log(data);

    Wallet.onConnect().then( () => {

      if(!Wallet.selectedAccount){
        alert('Please connect your wallet to continue!');
        return;
      }

      let walletAddress = Wallet.selectedAccount.toLowerCase()

      let timestamp = Date.now()

      let optionText, optionId = null;

      if (proposal.ProposalType == 'yes_no'){
        optionId = data.option;
        optionText = data.option;
      } else {
        optionId = data.option;
        optionText = proposal.Options[data.option];
      }

      let message = 'Proposal id: ' + ProposalId + '\n' +
                    'Proposal title: '+ proposal.Title + '\n' +
                    'Option: ' + optionText + '\n' +
                    'Timestamp: ' + timestamp;

      let password = ''
      web3.eth.personal.sign(
        message,
        walletAddress,
        password,
        function (err, signature) {

          if (err) {
            alert('Signature Denied');
            return;
          }
          if (signature) {

            console.log('signature! ' + signature)

            let xhr = new XMLHttpRequest()
            xhr.responseType = 'json';
            xhr.open('POST', BASE_URL + '/submitvote', true)
            xhr.setRequestHeader('Content-Type', 'application/json')

            xhr.onreadystatechange = function () {
              if (xhr.readyState == XMLHttpRequest.DONE) {

                console.log('response: ' + xhr.response)

                if (xhr.status == 200) {
                  let result = xhr.response;

                  if (result.error) {
                    if(result.error.code == 'ConditionalCheckFailedException'){
                      alert('You have already voted!')
                    } else if(result.error.msg){
                      alert(result.error.msg)
                    } else {
                      alert('Vote submission failed\n' + xhr.response)
                    }
                  } else {
                    getVotesTable(proposal, ProposalId, setList) //update vote table
                    alert('Vote submitted successfully')
                  }

                } else if (xhr.status == 500) {
                  alert('Internor Error, please inform the devs!\n' + xhr.response);
                } else {
                  alert('Error!\n' + xhr.response);
                }

              }
            }

            xhr.send(
              JSON.stringify({
                voteClass: ProposalId,
                voteValue: optionId,
                optionText: optionText,
                signature: signature,
                walletAddress: walletAddress,
                timestamp: timestamp,
                proposalTitle: proposal.Title
              })
            )
          }
        }
      );
    });
  }

  useEffect(() => {
    let xhttp = new XMLHttpRequest()
    xhttp.responseType = 'json';
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        let proposal = xhttp.response

        setProposal(proposal)

        getVotesTable(proposal, ProposalId, setList)

      }
    }

    xhttp.open('GET', BASE_URL + '/singleproposalquery?proposal='+encodeURI(ProposalId), true)
    xhttp.send()
  }, [])


  const [proposal, setProposal] = React.useState({})
  const [list, setList] = React.useState([])

  const translateVote = (vote) => {
    if(proposal.ProposalType == 'yes_no'){ return vote; }
    else {return proposal.Options[vote];}
  }

  const YesAndNoOptionsRadio = () => {
    return (
      <div>
        <div className="form-check mb-3">
          <input
              {...register("option", { required: true })}
              type="radio"
              name="option"
              value="yes"
              id="field-yes"
              className="form-check-input"
          />
          <label className="form-check-label" htmlFor="field-yes">
            Yes
          </label>
        </div>
        <div className="form-check mb-3">
          <input
              {...register("option", { required: true })}
              type="radio"
              name="option"
              value="no"
              id="field-no"
              className="form-check-input"
          />
          <label className="form-check-label" htmlFor="field-no">
            No
          </label>
          {errors.option?.type === 'required' && "You need to choose one option."}
        </div>
      </div>
    )
  }

  const MultiOptions = (args) => {
    return (
      <div>
        {args.Options.map((option, index) => (

          <div className="form-check mb-3" key={"option-"+index}>
            <input
                {...register("option", { required: true })}
                type="radio"
                name="option"
                value={index}
                id={"option-"+index}
                className="form-check-input"
            />
            <label className="form-check-label" htmlFor={"option-"+index}>
              {option}
            </label>
          </div>

        ))}
      </div>
    )
  }

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
                <li className="list-inline-item">Started on {(new Date(parseInt(proposal.CreationTime))).toLocaleString()}</li>
                <li className="list-inline-item">|</li>
                <li className="list-inline-item">Author: {proposal.WalletAddress}</li>
              </ul>
              {proposal.EndTimestamp &&
                (
                  <ul className="notification-meta list-inline mb-0">
                    <li className="list-inline-item">
                      {parseInt(proposal.EndTimestamp) > Date.now()
                        ? 'Ends on '
                        : 'Ended on '
                      }
                      <strong>{(new Date(parseInt(proposal.EndTimestamp))).toLocaleString()}</strong>
                    </li>
                  </ul>
                )
              }
            </div>
            {/*//col*/}
          </div>
          {/*//row*/}
        </div>
        {/*//app-card-header*/}
        <div className="app-card-body p-4">

          <div className="notification-content">
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-lg-2">
                  <canvas id="myChart"></canvas>
                </div>
                <div className="col">
                  {proposal.Description}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*//app-card-body*/}

        <div className="app-card-footer px-4 py-3">

          {proposal.EndTimestamp && parseInt(proposal.EndTimestamp) > Date.now()
            ? (
              <form id="vote_form" className="" onSubmit={handleSubmit(onSubmit)}>

                {(proposal && proposal.Title &&
                  (proposal.ProposalType != 'yes_no' && proposal.Options ?
                    <MultiOptions Options={proposal.Options} />
                    :
                    <YesAndNoOptionsRadio />
                  )
                )}

                <button type="submit" className="btn btn-primary">
                  Vote
                </button>
              </form>
            )
            : (proposal.Title && ( //check if proposal was already loaded to confirm if the perioed really ended
              <div>Voting period ended!</div>
            ))
          }
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
                    <td className="cell">{translateVote(item.voteValue)}</td>
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
