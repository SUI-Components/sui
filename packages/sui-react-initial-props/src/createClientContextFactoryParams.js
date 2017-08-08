export default function createClientContextFactoryParams () {
  return {
    cookies: document.cookie,
    pathName: window.location.pathname,
    userAgent: window.navigator.userAgent
  }
}
