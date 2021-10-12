import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
import { ProposalComp } from './ProposalComp'
import { BASE_URL } from '../../shared/urls.js'

export function Proposals() {
  useEffect(() => {
    let xhttp = new XMLHttpRequest()
    xhttp.responseType = 'json';
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.response)
        // Typical action to be performed when the document is ready:
        // document.getElementById("demo").innerHTML = xhttp.responseText;

        let result = xhttp.response

        // sort by creationTime
        result.items.sort(function (a, b) {
          return b.creationTime - a.creationTime;
        });

        setList(result.items)

      }
    }
    xhttp.open('GET', BASE_URL + '/privacyproposalquery', true)
    xhttp.send()
  }, [])



  const [list, setList] = React.useState([])

  return (
    <div className="container-xl">
      <Link to="/">Home</Link>
      <div className="position-relative mb-3">
        <div className="row g-3 justify-content-between">
          <div className="col-auto">
            <h1 className="app-page-title mb-0">Proposals</h1>
          </div>
        </div>
      </div>

      {list.map((item) => (
        <ProposalComp key={item.proposalId} proposal={item} />
      ))}

    </div>
  )
}
