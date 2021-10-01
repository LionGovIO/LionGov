import styled from "styled-components"

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
      color: var(--million);
    }
  }
`
