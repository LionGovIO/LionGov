import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
import { PointsTable } from './PointsTable'
import { BASE_URL } from '../../shared/urls.js'
import { useParams } from 'react-router-dom'


export function WeightPoints(){
  let params = document.location.pathname.match(/[^\/]+/g);

  //Allows to see the voting weight of other addresses
  let address = (Web3.utils.isAddress(params[1]) ? params[1] : null)

  let getVoteWeightTable = async () => {

    if (!address) { //if we did not specify an address, tries to get the user wallet address

      await Wallet.onConnect()
        console.log(address);

      if(!Wallet.selectedAccount){
        alert('Please connect your wallet to continue!');

        Wallet.onConnectCallBack = () => {
          getVoteWeightTable();
          Wallet.onConnectCallBack = null;
        }

        return;
      }

      address = Wallet.selectedAccount;

    }

    axios.get(BASE_URL + '/getvoteweight', {
      params: {
        walletAddress: address
      }
    })
    .then(function (response) {
      setList(response.data)
    })
    .catch(console.error)


  }

  useEffect(getVoteWeightTable, [])

  const [listTotal, setList] = React.useState({details: [], token_balance:null, voteWeight: null})

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

      { (listTotal.details.map((PointsInChain) => {
        return (PointsInChain.token_balance > 0 ? (<PointsTable key={PointsInChain.chain} PointsInChain={PointsInChain} />): '')
      }) )}

      <center>Total: <b>{listTotal.token_balance} MM</b> -> Weight: <b>{listTotal.voteWeight}</b></center>

    </div>
  )
}
