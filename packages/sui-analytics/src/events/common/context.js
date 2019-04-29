export default {
  library: {
    name: 'sui-analytics',
    version: 1 // how do we load the package.json version?
  },
  page: {
    path: window.location.pathname,
    referrer: document.referrer,
    search: window.location.search,
    title: document.title,
    url: window.location.origin
  },
  userAgent: window.navigator.userAgent
}
