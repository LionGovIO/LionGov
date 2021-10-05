import React from 'react'
import { cardList } from '../../assets/svg/cardList'
import { chevronDown } from '../../assets/svg/chevronDown'
import { columnsGap } from '../../assets/svg/columnsGap'
import { files } from '../../assets/svg/files'
import { folder } from '../../assets/svg/folder'
import { gear } from '../../assets/svg/gear'
import { houseDoor } from '../../assets/svg/houseDoor'

export function Sidebar() {
  return (
    <div id="app-sidepanel" className="app-sidepanel">
      <div id="sidepanel-drop" className="sidepanel-drop" />
      <div className="sidepanel-inner d-flex flex-column">
        <a href="#" id="sidepanel-close" className="sidepanel-close d-xl-none">
          ×
        </a>
        <div className="app-branding">
          <a
            className="app-logo"
            href="index.html"
            style={{ 'textAlign': 'center' }}
          >
            <img
              className="logo-icon me-2"
              src="/liongov-right.png"
              style={{ height: '58px', width: 'auto', padding: 'auto' }}
            ></img>
          </a>
        </div>

        <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1">
          <ul className="app-menu list-unstyled accordion" id="menu-accordion">
            <li className="nav-item">
              <a className="nav-link active" href="index.html">
                <span className="nav-icon">{houseDoor}</span>
                <span className="nav-link-text">Overview</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="docs.html">
                <span className="nav-icon">{folder}</span>
                <span className="nav-link-text">Docs</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="orders.html">
                <span className="nav-icon">{cardList}</span>
                <span className="nav-link-text">Governance</span>
              </a>
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
                    <a className="submenu-link" href="notifications.html">
                      All proposals
                    </a>
                  </li>
                  <li className="submenu-item">
                    <a className="submenu-link" href="notifications.html">
                      My proposals
                    </a>
                  </li>
                  <li className="submenu-item">
                    <a className="submenu-link" href="account.html">
                      Submit proposal
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="docs.html">
                <span className="nav-icon">{columnsGap}</span>
                <span className="nav-link-text">Weight points</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="app-sidepanel-footer">
          <nav className="app-nav app-nav-footer">
            <ul className="app-menu footer-menu list-unstyled">
              <li className="nav-item">
                <a className="nav-link" href="settings.html">
                  <span className="nav-icon">{gear}</span>
                  <span className="nav-link-text">Settings</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
