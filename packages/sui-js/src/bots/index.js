const BOTS_USER_AGENTS = [
  'googlebot',
  'google-structured-data-testing-tool',
  'bingbot',
  'linkedinbot',
  'mediapartners-google',
  'debugbear'
]

const checkUserAgentIsBot = (userAgent, botsUserAgents) => {
  const lowerCaseUserAgent = userAgent.toLowerCase()

  const botsUserAgentsList = botsUserAgents || BOTS_USER_AGENTS

  return botsUserAgentsList.some(ua => lowerCaseUserAgent.includes(ua))
}

export {checkUserAgentIsBot, BOTS_USER_AGENTS}
