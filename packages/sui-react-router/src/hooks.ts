import { useContext } from 'react'
import Context from './internal/Context'
import { Location, Params, Router } from './types'

const useRouterContext = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('@s-ui/react-router must be used within a <Router />')
  }
  return context
}

export const useParams = (): Params => useRouterContext().router.params

export const useLocation = (): Location => useRouterContext().router.location

export const useRouter = (): Router => useRouterContext().router
