// Extracted from: https://github.com/fahidmohammad/seo-bot-detect

// Export Bot Detect Module
module.exports = function(req) {
  // Get the request user agent info
  const userAgent = req.headers['user-agent'] || ''

  // Convert all character cases to lower to avoid linux environment mismatching
  userAgent.toLowerCase()

  // Define all known bot list under regex
  const BOT_REGEX = /bot|crawler|baiduspider|80legs|mediapartners-google|adsbot-google|008|abachobot|accoona-ai-agent|addsugarspiderbot|anyapexbot|arachmo|b-l-i-t-z-b-o-t|baiduspider|becomebot|beslistbot|billybobbot|bimbot|bingbot|blitzbot|boitho.com-dc|boitho.com-robot|btbot|catchbot|cerberian drtrs|charlotte|converacrawler|cosmos|covario ids|dataparksearch|diamondbot|discobot|dotbot|emeraldshield.com |webbot|esperanzabot|exabot|fast enterprise crawler|fast-webcrawler|fdse robot|findlinks|furlbot|fyberspider|g2crawler|gaisbot|galaxybot|geniebot|gigabot|girafabot|googlebot|googlebot-image|gurujibot|happyfunbot|hl_ftien_spider|holmes|htdig|iaskspider|ia_archiver|iccrawler|ichiro|igdespyder|irlbot|issuecrawler|jaxified bot|jyxobot|koepabot|l.webis|lapozzbot|larbin|ldspider|lexxebot|linguee bot|linkwalker|lmspider|lwp-trivial|mabontland|magpie-crawler|mediapartners-google|mj12bot|mnogosearch|mogimogi|mojeekbot|moreoverbot|morning paper|msnbot|msrbot|mvaclient|mxbot|netresearchserver|netseer crawler|newsgator|ng-search|nicebot|noxtrumbot|nusearch spider|nutchcvs|nymesis|obot|oegp|omgilibot|omniexplorer_bot|oozbot|orbiter|pagebiteshyperbot|peew|polybot|pompos|postpost|psbot|pycurl|pingdom.com_bot_version|qseero|radian6|rampybot|rufusbot|sandcrawler|sbider|scoutjet|scrubby|searchsight|seekbot|semanticdiscovery|sensis web crawler|seochat::bot|seznambot|shim-crawler|shopwiki|shoula robot|silk|sitebot|snappy|sogou spider|sosospider|speedy spider|sqworm|stackrambler|suggybot|surveybot|synoobot|teoma|terrawizbot|thesubot|thumbnail.cz robot|tineye|truwogps|turnitinbot|tweetedtimes bot|twengabot|updated|urlfilebot|vagabondo|voilabot|vortex|voyager|vyu2|webcollage|websquash.com|wf84|wofindeich robot|womlpefactory|xaldon_webspider|yacy|yahoo! slurp|yahoo! slurp china|yahooseeker|yahooseeker-testing|yandexbot|yandeximages|yasaklibot|yeti|yodaobot|yooglifetchagent|youdaobot|zao|zealbot|zspider|zyborg/i

  return BOT_REGEX.test(userAgent || false)
}
