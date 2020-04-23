// from: https://github.com/ReactTraining/react-router/blob/v3/modules/index.js
// as @s-ui/react-router is a subset of react-router@3, some exports are missing

/* components */
export {default as Router} from './Router'
export {default as Link} from './Link'
export {default as withRouter} from './withRouter'

/* components (configuration) */
export {default as Redirect} from './Redirect'
export {default as Route} from './Route'
export {default as IndexRoute} from './IndexRoute'

/* utils */
export {default as match} from './match'

/* histories */
export {default as browserHistory} from './browserHistory'

/* hooks */
export {useLocation, useParams, useRouter} from './hooks'
