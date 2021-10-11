import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
import { PointsTable } from './PointsTable'
import { BASE_URL } from '../../shared/urls.js'


export function WeightPoints() {

  let getVoteWeightTable = () => {
    Wallet.onConnect().then( () => {

      if(!Wallet.selectedAccount){
        alert('Please connect your wallet to continue!');

        Wallet.onConnectCallBack = () => {
          getVoteWeightTable();
          Wallet.onConnectCallBack = null;
        }

        return;
      }

      console.log('/getvoteweight?walletAddress=' + encodeURI(Wallet.selectedAccount));

      let xhttp = new XMLHttpRequest()
      xhttp.responseType = 'json';
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
          if (xhttp.status == 200) {
            let result = xhttp.response;
            console.log(result)

            if (result.error) {
              if(result.error.msg){
                alert(result.error.msg)
              } else {
                alert('Error\n' + xhttp.response)
              }
            } else { //If successful
              setList(result.details)  // update table
            }

          } else if (xhttp.status == 500) {
            alert('Internor Error, please inform the devs!\n' + xhttp.response);
          } else {
            alert('Error!\n' + xhttp.response);
          }
        }

      }
      xhttp.open(
        'GET',
        BASE_URL + '/getvoteweight?walletAddress=' + encodeURI(Wallet.selectedAccount),
        true
      )
      xhttp.send()

    });
  }

  useEffect(getVoteWeightTable, [])

  const [listTotal, setList] = React.useState([])

  return (
    <div className="container-xl">
      <Link to="home">Home</Link>
      <div className="position-relative mb-3">
        <div className="row g-3 justify-content-between">
          <div className="col-auto">
            <h1 className="app-page-title mb-0">Weight Points</h1>
          </div>
        </div>
      </div>

      { listTotal.map((PointsInChain) => (
        <PointsTable key={PointsInChain.chain} PointsInChain={PointsInChain} />
      ))}

    </div>
  )
}
