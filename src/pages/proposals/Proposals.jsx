import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { arrowRight } from '../../assets/svg/arrowRight'
import { barChartLine } from '../../assets/svg/barChartLine'
import { receipt } from '../../assets/svg/receipt'
import { ProposalComp } from './ProposalComp'
import { BASE_URL } from '../../shared/urls.js'


function ListProposals() {
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = () => {

    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText)
      // Typical action to be performed when the document is ready:
      // document.getElementById("demo").innerHTML = xhttp.responseText;

      var result = JSON.parse(xhttp.responseText)

      var items = result.items

      setList(proposalitems)

      list = items

    }
  }
  xhttp.open('GET', BASE_URL + '/privacyproposalquery', true)
  xhttp.send()

}

export function Proposals() {
  useEffect(() => {
    ListProposals()
  })

  const [list, setList] = React.useState();

  return (
    <div className="container-xl">
      <Link to="home">Home</Link>
      <div className="position-relative mb-3">
        <div className="row g-3 justify-content-between">
          <div className="col-auto">
            <h1 className="app-page-title mb-0">Proposals</h1>
          </div>
        </div>
      </div>

      {list.map(item => (
        <ProposalComp key={item.proposalId} proposal={item} />
      ))}

      {/*//app-card*/}
      <div className="app-card app-card-notification shadow-sm mb-4">
        <div className="app-card-header px-4 py-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <div className="app-icon-holder">{receipt}</div>
              {/*//app-icon-holder*/}
            </div>
            {/*//col*/}
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <div className="notification-type mb-2">
                <span className="badge bg-warning">Project</span>
              </div>
              <h4 className="notification-title mb-1">
                LionRun - Jacuzzi bar new year event
              </h4>
              <ul className="notification-meta list-inline mb-0">
                <li className="list-inline-item">1 day ago</li>
                <li className="list-inline-item">|</li>
                <li className="list-inline-item">0x98451bnas78912ji14234t</li>
              </ul>
            </div>
            {/*//col*/}
          </div>
          {/*//row*/}
        </div>
        {/*//app-card-header*/}
        <div className="app-card-body p-4">
          <div className="notification-content">
            Promote a new year party at the LionRun's Jacuzzi bar to celebrate 1
            Billion Marketcap!
          </div>
        </div>
        {/*//app-card-body*/}
        <div className="app-card-footer px-4 py-3">
          <a className="action-link" href="#">
            Vote!
            {arrowRight}
          </a>
        </div>
        {/*//app-card-footer*/}
      </div>
      {/*//app-card*/}
      <div className="app-card app-card-notification shadow-sm mb-4">
        <div className="app-card-header px-4 py-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <div className="app-icon-holder icon-holder-mono">
                {barChartLine}
              </div>
              {/*//app-icon-holder*/}
            </div>
            {/*//col*/}
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <div className="notification-type mb-2">
                <span className="badge bg-info">Project</span>
              </div>
              <h4 className="notification-title mb-1">
                Notification Heading Lorem Ipsum
              </h4>
              <ul className="notification-meta list-inline mb-0">
                <li className="list-inline-item">3 days ago</li>
                <li className="list-inline-item">|</li>
                <li className="list-inline-item">System</li>
              </ul>
            </div>
            {/*//col*/}
          </div>
          {/*//row*/}
        </div>
        {/*//app-card-header*/}
        <div className="app-card-body p-4">
          <div className="notification-content">
            Proin a magna sit amet mauris mollis mattis in at dui. Fusce laoreet
            metus et nunc lobortis, suscipit sollicitudin augue pellentesque.
            Maecenas maximus iaculis scelerisque.
          </div>
        </div>
        {/*//app-card-body*/}
        <div className="app-card-footer px-4 py-3">
          <a className="action-link" href="#">
            View invoice
            {arrowRight}
          </a>
        </div>
        {/*//app-card-footer*/}
      </div>
      {/*//app-card*/}
      <div className="app-card app-card-notification shadow-sm mb-4">
        <div className="app-card-header px-4 py-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <img
                className="profile-image"
                src="assets/images/profiles/profile-2.png"
                alt=""
              />
            </div>
            {/*//col*/}
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <div className="notification-type mb-2">
                <span className="badge bg-secondary">Product</span>
              </div>
              <h4 className="notification-title mb-1">
                Notification Heading Lorem Ipsum
              </h4>
              <ul className="notification-meta list-inline mb-0">
                <li className="list-inline-item">7 days ago</li>
                <li className="list-inline-item">|</li>
                <li className="list-inline-item">James Smith</li>
              </ul>
            </div>
            {/*//col*/}
          </div>
          {/*//row*/}
        </div>
        {/*//app-card-header*/}
        <div className="app-card-body p-4">
          <div className="notification-content">
            Sed tempor faucibus arcu, nec tristique erat congue sed.
            Pellentesque auctor ut elit vel feugiat. Sed a mauris tempor, tempor
            lacus vel, tristique metus. Nulla interdum felis id metus fermentum
            laoreet.
          </div>
        </div>
        {/*//app-card-body*/}
        <div className="app-card-footer px-4 py-3">
          <a className="action-link" href="#">
            View all
            {arrowRight}
          </a>
        </div>
        {/*//app-card-footer*/}
      </div>
      {/*//app-card*/}
      <div className="app-card app-card-notification shadow-sm mb-4">
        <div className="app-card-header px-4 py-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <img
                className="profile-image"
                src="assets/images/profiles/profile-3.png"
                alt=""
              />
            </div>
            {/*//col*/}
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <div className="notification-type mb-2">
                <span className="badge bg-success">News</span>
              </div>
              <h4 className="notification-title mb-1">
                Notification Heading Lorem Ipsum
              </h4>
              <ul className="notification-meta list-inline mb-0">
                <li className="list-inline-item">7 days ago</li>
                <li className="list-inline-item">|</li>
                <li className="list-inline-item">Kate Sanders</li>
              </ul>
            </div>
            {/*//col*/}
          </div>
          {/*//row*/}
        </div>
        {/*//app-card-header*/}
        <div className="app-card-body p-4">
          <div className="notification-content">
            Sed tempor faucibus arcu, nec tristique erat congue sed.
            Pellentesque auctor ut elit vel feugiat. Sed a mauris tempor, tempor
            lacus vel, tristique metus. Nulla interdum felis id metus fermentum
            laoreet.
          </div>
        </div>
        {/*//app-card-body*/}
        <div className="app-card-footer px-4 py-3">
          <a className="action-link" href="#">
            Read more
            {arrowRight}
          </a>
        </div>
        {/*//app-card-footer*/}
      </div>
      {/*//app-card*/}
      <div className="text-center mt-4">
        <a className="btn app-btn-secondary" href="#">
          Load more notifications
        </a>
      </div>
    </div>
  )
}
