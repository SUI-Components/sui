import {getAdobeMCVisitorID, getAdobeVisitorData} from '../src/repositories/adobeRepository.js'
import analytics from '../src/index.js'

const w = window

w.sui = w.sui || {}
w.sui.analytics = w.sui.analytics || analytics
w.sui.analytics.getAdobeVisitorData = w.sui.analytics.getAdobeVisitorData || getAdobeVisitorData
w.sui.analytics.getAdobeMCVisitorID = w.sui.analytics.getAdobeMCVisitorID || getAdobeMCVisitorID
