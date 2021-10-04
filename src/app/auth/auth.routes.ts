import { IRoutes } from '../../shared/shared.dev.models'

export const AUTH_ROUTES: IRoutes = Object.freeze({
    google: {
        path: '/google',
        subRouting: {
            redirect: {
                path: '/redirect'
            }
        }
    }
})