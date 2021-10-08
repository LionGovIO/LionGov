import React from 'react'
import ConnectWalletBtn  from './ConnectWalletBtn'
import {
  HeaderContainer,
  LinksConnectWallet,
  LogoContainer,
  SocialIcon,
  Socials,
} from './Header.styles'

export function Header() {
  return (

    <HeaderContainer className="app-header fixed-top">

          <div className="app-header-inner">
            <div className="container-fluid py-2">
              <div className="app-header-content">
                <div className="row justify-content-between align-items-center">
                  <div className="col-auto">
                    <a id="sidepanel-toggler" className="sidepanel-toggler d-inline-block d-xl-none" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 30 30" role="img"><title>Menu</title><path stroke="currentColor" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={2} d="M4 7h22M4 15h22M4 23h22" /></svg>
                    </a>
                  </div>{/*//col*/}
                  <div className="search-mobile-trigger d-sm-none col">
                    <i className="search-mobile-trigger-icon fas fa-search" />
                  </div>{/*//col*/}
                  <div className="app-search-box col">
                  </div>{/*//app-search-box*/}
                  <div className="app-utilities col-auto">
                    <div className="app-utility-item">
                      <ConnectWalletBtn/>
                    </div>{/*//app-utility-item*/}
                  </div>{/*//app-utilities*/}
                </div>{/*//row*/}
              </div>{/*//app-header-content*/}
            </div>{/*//container-fluid*/}
          </div> {/*<BigButton id="btn-connect-wallet">Connect wallet</BigButton>*/}

    </HeaderContainer>
  )
}
