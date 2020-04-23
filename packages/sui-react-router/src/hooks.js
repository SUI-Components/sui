import {useContext} from 'react'
import Context from './internal/Context'

const useRouterContext = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('@s-ui/react-router must be used within a <Router />')
  }
  return context
}

export const useParams = () => useRouterContext().router.params
export const useLocation = () => useRouterContext().router.location
export const useRouter = () => useRouterContext().router
