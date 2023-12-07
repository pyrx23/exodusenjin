/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/*
 * For visitors from outside the EU, initialize Google Analytics with
 * cookies enabled. For visitors located in EU countries, if consent is not given
 * show the cookies banner and initialize Analytics without cookies.
 * If consent has been given, initialize Analytics with cookies.
 *
 * COOKIES:
 * ex_consent
 * - set to "1" if consent was given
 * - undefined when consent has not been given
 *
 * NOTES:
 * - functions check whether document is defined to avoid build failures
 * - banner component is implemented in pure JS so this file
 *   can be included as-is regardless of platform or framework
 */

function initGA(disableCookies) {
  // Universal Google Analytics:
  ;(function (i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r
    ;(i[r] =
      i[r] ||
      function () {
        ;(i[r].q = i[r].q || []).push(arguments)
      }),
      (i[r].l = 1 * new Date())
    ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
    a.async = 1
    a.src = g
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

  const ugId = disableCookies ? 'UA-672157-18' : 'UA-672157-16'
  const uaOptions = disableCookies ? { storage: 'none' } : 'auto'

  ga('create', ugId, uaOptions)
  ga('set', 'allowAdFeatures', false)
  ga('send', 'pageview')

  // Goggle Analytics 4:
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const ga4Id = 'G-SXL70E35DQ'
  const ga4Options = disableCookies ? { storage: 'none' } : {}

  const script = document.createElement('script')
  script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`)
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('async', true)

  script.onerror = () => console.log('Error loading GA4 script.')

  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  gtag('js', new Date())
  gtag('config', ga4Id, ga4Options)
  gtag('set', { allowAdFeatures: false })
}

const setCookie = ({ name, value, daysToPersist, currentSubdomainOnly }) => {
  if (typeof document === 'undefined') return

  if (daysToPersist === 'forever') daysToPersist = 1000
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * (daysToPersist || 0)).toUTCString()
  const expires = daysToPersist ? `;expires=${expiryDate}` : ''

  // share across subdomains (support.exodus.com) unless currentSubdomainOnly
  const shareAcrossSubdomains = !currentSubdomainOnly
  const domain = shareAcrossSubdomains ? ';domain=exodus.com' : ''

  document.cookie = `${name}=${value};path=/${expires}${domain}`
}

function getCookie(name) {
  if (typeof document === 'undefined') return

  const cookies = {}

  decodeURIComponent(document.cookie)
    .split(';')
    .forEach((str) => {
      const [name, value] = str.trim().split('=')
      cookies[name] = value
    })

  return cookies[name]
}

function deleteCookie({ name }) {
  if (typeof document === 'undefined') return

  // set the expires parameter to a passed date
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * -1000).toUTCString()

  document.cookie = `${name}=;expires=${expires};path=/`
}

async function checkConsent() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  let resRaw
  try {
    resRaw = await fetch('https://www.exodus.com/api/is-eu-country')
  } catch (err) {
    console.error(err)
    return
  }

  if (resRaw.status === 200) {
    const res = await resRaw.json()
    const isEU = res.isEUCountry === 1

    if (!isEU) {
      return initGA()
    }

    const consentValue = getCookie('ex_consent')

    if (consentValue === '1') {
      initGA()
    } else {
      deleteCookie({ name: '_ga' })
      deleteCookie({ name: '_gid' })

      showBanner()

      const disableCookies = true
      initGA(disableCookies)
    }
  }
}

checkConsent()

function showBanner() {
  // styles
  const style = document.createElement('style')
  style.type = 'text/css'

  const css =
    '.x-cookies-banner{position:fixed;bottom:0;left:0;z-index:1000;width:100%;height:75px;background-color:#161420;transition:opacity .4s ease}.x-cookies-banner.hide{opacity:0;pointer-events:none}.x-cookies-banner-inner{padding:0 20px;max-width:1130px;display:flex;align-items:center;justify-content:space-between;height:100%;margin:auto}.x-cookies-banner-text{color:#bfbfc1;font-size:14px}.x-cookies-banner-buttons-container{white-space:nowrap}.x-cookies-banner-button{outline:0;cursor:pointer;height:32px;border:none;color:#cac9cc;border-radius:16px;text-transform:uppercase;font-size:11px;opacity:.8;transition:opacity .2s ease}.x-cookies-banner-button:hover{opacity:1}.x-cookies-banner-primary{background-image:linear-gradient(to right,#292732,#3b3943);padding:0 30px;margin-left:10px}.x-cookies-banner-secondary{background:0 0;border:1px solid #36343e;padding:0 18px;margin-right:10px}@media (max-width:750px){.x-cookies-banner{height:initial}.x-cookies-banner-inner{flex-direction:column;justify-content:center;padding:20px}.x-cookies-banner-text{margin-bottom:14px;text-align:center}}.BeaconFabButtonFrame{bottom:138px!important}@media (min-width:485px){.BeaconFabButtonFrame{bottom:118px!important}}@media (min-width:751px){.BeaconFabButtonFrame{bottom:90px!important}.BeaconContainer{bottom:160px!important}}'

  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }

  const head = document.head || document.getElementsByTagName('head')[0]
  head.appendChild(style)

  // html
  const banner = document.createElement('div')
  banner.classList.add('x-cookies-banner')

  const inner = document.createElement('div')
  inner.classList.add('x-cookies-banner-inner')

  const text = document.createElement('div')
  text.innerHTML = 'Allow us to use cookies to give you the best experience on our website?'
  text.classList.add('x-cookies-banner-text')

  const buttonsContainer = document.createElement('div')
  buttonsContainer.classList.add('x-cookies-banner-buttons-container')

  const acceptButton = document.createElement('button')
  acceptButton.classList.add('x-cookies-banner-button')
  acceptButton.classList.add('x-cookies-banner-primary')
  acceptButton.innerHTML = 'Accept'

  acceptButton.addEventListener('click', function () {
    banner.classList.add('hide')

    setCookie({ name: 'ex_consent', value: '1', daysToPersist: 'forever' })

    setTimeout(() => {
      banner.parentNode.removeChild(banner)
      style.parentNode.removeChild(style)
    }, 500)
  })

  const privacyLink = document.createElement('a')
  privacyLink.href = 'https://www.exodus.com/privacy'

  const privacyButton = document.createElement('button')
  privacyButton.classList.add('x-cookies-banner-button')
  privacyButton.classList.add('x-cookies-banner-secondary')
  privacyButton.innerHTML = 'Privacy Policy'

  privacyLink.appendChild(privacyButton)

  buttonsContainer.appendChild(privacyLink)
  buttonsContainer.appendChild(acceptButton)

  inner.appendChild(text)
  inner.appendChild(buttonsContainer)

  banner.appendChild(inner)

  document.body.appendChild(banner)
}
