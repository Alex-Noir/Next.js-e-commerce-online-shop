import { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as gtag from '../../lib/gtag'

import Header from './layout/Header'
const AuthForm = dynamic(() => import('./layout/AuthForm'))
import CookieBanner from './layout/CookieBanner'
import Footer from './layout/Footer'

export default function Layout(props) {
  const [ isAuthModalVisible, setIsAuthModalVisible ] = useState(false)
  const [ isLogInTabVisible, setIsLogInTabVisible ] = useState(null)
  const [ areCookiesAccepted, setAreCookiesAccepted ] = useState(false)
  const [ isCookieBannerVisible, setIsCookieBannerVisible ] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('areCookiesAccepted') !== null) {
      if (localStorage.getItem('areCookiesAccepted') === 'false') {
        setAreCookiesAccepted(false)
      } else {
        setAreCookiesAccepted(true)
      }
    }

    if (
      localStorage.getItem('isCookieBannerVisible') !== null ||
      localStorage.getItem('isCookieBannerVisible') === 'false'
    ) {
      setIsCookieBannerVisible(false)
    } else {
      setIsCookieBannerVisible(true)
    }

  }, [])

  const handleVisibility = e => {
    if (e.currentTarget.name === 'logIn') {
      setIsAuthModalVisible(true)
      setIsLogInTabVisible(true)
      document.body.style.overflow = 'hidden'
    } else if (e.currentTarget.name === 'singUp') {
      setIsAuthModalVisible(true)
      setIsLogInTabVisible(false)
      document.body.style.overflow = 'hidden'
    }
  }

  const closeAuthModal = e => {
    if (e.target.id === 'outsideAuthModal') {
      setIsAuthModalVisible(false)
      document.body.style.overflow = 'visible'
    }
  }

  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <GlobalStyle />
      <DivGrid>
        <Header handleVisibility={handleVisibility} />
        {
          isAuthModalVisible
          ? <AuthForm 
              isLogInTabVisible={isLogInTabVisible}
              closeAuthModal={closeAuthModal}
              handleVisibility={handleVisibility} 
            />
          : null
        }
        {props.children}
        <CookieBanner areCookiesAccepted={areCookiesAccepted} />
        <Footer setIsCookieBannerVisible={setIsCookieBannerVisible} />
      </DivGrid>
    </>
  )
}

const GlobalStyle = createGlobalStyle` 
  * {
    box-sizing: border-box;
    &:not([data-offset-key]):not([data-text]) {
      font-family: 'Roboto Condensed', sans-serif;
    }
  }

  html, body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Georgia, sans-serif;
    height: 100%;
    scroll-behavior: smooth;
    background-color: #e9e9e9; 
  }

  #__next {
    height: 100%;
  }
`

const DivGrid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto 100% auto;
  height: 100%;
  position: relative;
  > :nth-child(3) {
    
  }

  @media only screen and (min-width: 1220px) {
    grid-template-columns: 1fr 1200px 1fr;
  }
`
