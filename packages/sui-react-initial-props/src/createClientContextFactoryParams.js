export default function createClientContextFactoryParams() {
  return {
    appConfig: window.__APP_CONFIG__,
    cookies: document.cookie,
    isClient: true,
    pathName: window.location.pathname,
    userAgent: window.navigator.userAgent
  }
}
