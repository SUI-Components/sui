// @ts-check
// from: https://github.com/ReactTraining/react-router/blob/v3/modules/index.js
// as @s-ui/react-router is a subset of react-router@3, some exports are missing

/* components */
export {default as Router} from './Router.js'
export {default as Link} from './Link.js'
export {default as withRouter} from './withRouter.js'

/* components (configuration) */
export {default as Redirect} from './Redirect.js'
export {default as Route} from './Route.js'
export {default as IndexRoute} from './IndexRoute.js'

/* utils */
export {default as match} from './match.js'

/* histories */
export {default as browserHistory} from './browserHistory.js'

/* context */
export {default as RouterContext} from './internal/Context.js'

/* hooks */
export {useLocation, useParams, useRouter} from './hooks.js'
