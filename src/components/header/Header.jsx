import React from 'react'
import { BigButton } from '../../shared/styles'
import {
  HeaderContainer,
  LinksConnectWallet,
  LogoContainer,
  SocialIcon,
  Socials,
} from './Header.styles'

export function Header() {
  return (
    <HeaderContainer>
      <LogoContainer>
        <a href="https://www.liongov.io/">LionGov.io</a>
      </LogoContainer>
        <BigButton id="btn-connect-wallet">Connect wallet</BigButton>
    </HeaderContainer>
  )
}
