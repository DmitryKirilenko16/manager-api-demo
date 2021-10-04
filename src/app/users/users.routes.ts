import { IRoutes } from '../../shared/shared.dev.models'

export const USERS_ROUTES: IRoutes = Object.freeze({
    users: {
        path: '/users',
        subRouting: {
            user: {
                path: '/:id',
                subRouting: {
                    userProject: {
                        path: '/user-projects',
                    },
                    bonuses: {
                        path: '/bonuses',
                    },
                },
            },
        },
    },
})

export const USERS_SUBROUTING = USERS_ROUTES.users.subRouting
export const USER_ENDPOINT = USERS_SUBROUTING.user.path
export const USER_SUBROUTING = USERS_SUBROUTING.user.subRouting
export const USER_PROJECT = USER_SUBROUTING.userProject.path
export const USER_BONUS = USER_SUBROUTING.bonuses.path
export const USER_PROJECT_ENDPOINT = `${USER_ENDPOINT}${USER_PROJECT}`
export const USER_BONUSES_ENDPOINT = `${USER_ENDPOINT}${USER_BONUS}`
