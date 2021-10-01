import styled from 'styled-components'

export const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  padding: 40px 30px;
`

export const LogoContainer = styled.div`
  a {
    color: white;
    font-size: 44px;
    font-weight: bold;
    outline: none;
    text-decoration: none;
  }
`

export const LinksConnectWallet = styled.div`
  flex-flow: row;
  display: flex;
  align-items: center;
  min-width: 300px;
`

export const Socials = styled.div`
  margin-right: 20px;

  a {
    margin: 0 5px;
  }
`

export const SocialIcon = styled.a`
  text-decoration: none;
  outline: none;
  cursor: pointer;

  svg {
    height: 20px;
    color: white;
    transition: 0.3s;
  }

  &:hover {
    svg {
      color: var(--primary);
    }
  }
`
