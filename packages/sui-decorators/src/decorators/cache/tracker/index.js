import isNode from '../../../helpers/isNode'
import BrowserTracker from './BrowserTracker'
import NodeTracker from './NodeTracker'

// FIXME:
// http://webpack.github.io/docs/configuration.html#resolve-packagealias
// https://github.com/defunctzombie/package-browser-field-spec#replace-specific-files---advanced
export default (isNode ? NodeTracker : BrowserTracker)
