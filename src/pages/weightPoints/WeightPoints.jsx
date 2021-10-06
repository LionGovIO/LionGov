import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
import { PointsTable } from './PointsTable'
import { BASE_URL } from '../../shared/urls.js'


export function WeightPoints() {
  useEffect(() => {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText)
        // Typical action to be performed when the document is ready:
        // document.getElementById("demo").innerHTML = xhttp.responseText;

        var result = JSON.parse(xhttp.responseText)

        console.log(result)

        setList(result.details)

      }
    }
    xhttp.open(
      'GET',
      BASE_URL + '/getvoteweight?walletAddress=0xd9f24B3A298a14d9b64a8155b590809CE682B3Bb' , //walletAddress
      true
    )
    xhttp.send()
  }, [])


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
