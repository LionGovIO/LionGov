import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
import { ProposalComp } from './ProposalComp'
import { BASE_URL } from '../../shared/urls.js'

export function Proposals() {
  useEffect(() => {

    axios.get(BASE_URL + '/privacyproposalquery')
    .then(function (response) {
      let result = response.data

      // sort by creationTime
      result.items.sort(function (a, b) {
        return b.CreationTime - a.CreationTime;
      });

      setList(result.items)
    })
    .catch(console.error)

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
        <ProposalComp key={item.ProposalId} proposal={item} />
      ))}

    </div>
  )
}
