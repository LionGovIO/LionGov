import React from 'react'
import { github } from '../../assets/svg/github'
import { facebook } from '../../assets/svg/facebook'
import { twitter } from '../../assets/svg/twitter'
import { reddit } from '../../assets/svg/reddit'
import { youtube } from '../../assets/svg/youtube'
import { telegram } from '../../assets/svg/telegram'
import { discord } from '../../assets/svg/discord'
import {
  SocialIcon,
  Socials,
} from './Footer.styles'


export function Footer() {
  return (
    <Socials>
      <SocialIcon target="_blank" href="https://github.com/LionGovIO/LionGov">
        {github}
      </SocialIcon>
      <SocialIcon target="_blank" href="https://t.me/MillionTokensofficial">
        {telegram}
      </SocialIcon>
      <SocialIcon target="_blank" href="https://discord.com/invite/JRPC4KhDJT">
        {discord}
      </SocialIcon>
      <SocialIcon
        target="_blank"
        href="https://www.youtube.com/channel/UCDZHd3pVb--auFwubY7Lbcw"
      >
        {youtube}
      </SocialIcon>
      <SocialIcon target="_blank" href="https://www.reddit.com/r/lionrun/">
        {reddit}
      </SocialIcon>
      <SocialIcon target="_blank" href="https://twitter.com/lionrunio">
        {twitter}
      </SocialIcon>
      <SocialIcon target="_blank" href="https://www.facebook.com/lionrunio8">
        {facebook}
      </SocialIcon>
    </Socials>
  )
}
