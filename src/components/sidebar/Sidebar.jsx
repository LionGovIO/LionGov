import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { cardList } from '../../assets/svg/cardList'
import { chevronDown } from '../../assets/svg/chevronDown'
import { columnsGap } from '../../assets/svg/columnsGap'
import { files } from '../../assets/svg/files'
import { folder } from '../../assets/svg/folder'
import { gear } from '../../assets/svg/gear'
import { houseDoor } from '../../assets/svg/houseDoor'

window.addEventListener('load', function () {

  /* ===== Responsive Sidepanel ====== */
  const sidePanelToggler = document.getElementById('sidepanel-toggler');
  const sidePanel = document.getElementById('app-sidepanel');
  const sidePanelDrop = document.getElementById('sidepanel-drop');
  const sidePanelClose = document.getElementById('sidepanel-close');

  window.addEventListener('load', function(){
  	responsiveSidePanel();
  });

  window.addEventListener('resize', function(){
  	responsiveSidePanel();
  });


  function responsiveSidePanel() {
      let w = window.innerWidth;
  	if(w >= 1200) {
  	    // if larger
  	    //console.log('larger');
  		sidePanel.classList.remove('sidepanel-hidden');
  		sidePanel.classList.add('sidepanel-visible');

  	} else {
  	    // if smaller
  	    //console.log('smaller');
  	    sidePanel.classList.remove('sidepanel-visible');
  		sidePanel.classList.add('sidepanel-hidden');
  	}
  };

  sidePanelToggler.addEventListener('click', () => {
  	if (sidePanel.classList.contains('sidepanel-visible')) {
  		console.log('visible');
  		sidePanel.classList.remove('sidepanel-visible');
  		sidePanel.classList.add('sidepanel-hidden');

  	} else {
  		console.log('hidden');
  		sidePanel.classList.remove('sidepanel-hidden');
  		sidePanel.classList.add('sidepanel-visible');
  	}
  });


  sidePanelClose.addEventListener('click', (e) => {
  	e.preventDefault();
  	sidePanelToggler.click();
  });

  sidePanelDrop.addEventListener('click', (e) => {
  	sidePanelToggler.click();
  });

});

export function Sidebar() {
  return (
    <div id="app-sidepanel" className="app-sidepanel" style={{ zIndex: '1'}}>
      <div id="sidepanel-drop" className="sidepanel-drop" />
      <div className="sidepanel-inner d-flex flex-column">
        <a href="#" id="sidepanel-close" className="sidepanel-close d-xl-none">
          ×
        </a>
        <div className="app-branding">
          <Link
            className="app-logo"
            to="/"
            style={{ 'textAlign': 'center' }}
          >
            <img
              className="logo-icon me-2"
              src="/assets/vectors/liongov-sq.svg"
              style={{ height: '58px', width: 'auto', padding: 'auto' }}
            ></img>
            <span className="logo-text">LionGov</span>
          </Link>
        </div>

        <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
          <ul className="app-menu list-unstyled accordion" id="menu-accordion">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                <span className="nav-icon">{houseDoor}</span>
                <span className="nav-link-text">Overview</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/">
                <span className="nav-icon">{folder}</span>
                <span className="nav-link-text">Docs</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/">
                <span className="nav-icon">{cardList}</span>
                <span className="nav-link-text">Governance</span>
              </Link>
            </li>

            <li className="nav-item has-submenu">
              <a
                className="nav-link submenu-toggle"
                href="#"
                data-bs-toggle="collapse"
                data-bs-target="#submenu-1"
                aria-expanded="false"
                aria-controls="submenu-1"
              >
                <span className="nav-icon">{files}</span>
                <span className="nav-link-text">Proposals</span>
                <span className="submenu-arrow">{chevronDown}</span>
              </a>

              <div
                id="submenu-1"
                className="collapse submenu submenu-1"
                data-bs-parent="#menu-accordion"
              >
                <ul className="submenu-list list-unstyled">
                  <li className="submenu-item">
                    <Link className="submenu-link" to="/">
                      All proposals
                    </Link>
                  </li>
                  <li className="submenu-item">
                    <Link className="submenu-link" to="/">
                      My proposals
                    </Link>
                  </li>
                  <li className="submenu-item">
                    <Link className="submenu-link" to="/SubmitProposal">
                      Submit proposal
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/WeightPoints">
                <span className="nav-icon">{columnsGap}</span>
                <span className="nav-link-text">Weight points</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="app-sidepanel-footer">
          <nav className="app-nav app-nav-footer">
            <ul className="app-menu footer-menu list-unstyled">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <span className="nav-icon">{gear}</span>
                  <span className="nav-link-text">Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
