export const checkAnonymousId = () => {
  const SEGMENT_ID_USER_WITHOUT_CONSENTS =
    window.__SEGMENT_WRAPPER?.SEGMENT_ID_USER_WITHOUT_CONSENTS ?? 'anonymous_user'

  const anonymousId = window.analytics.user?.()?.anonymousId()

  if (anonymousId === SEGMENT_ID_USER_WITHOUT_CONSENTS) {
    window.analytics.setAnonymousId(null)
  }
}
