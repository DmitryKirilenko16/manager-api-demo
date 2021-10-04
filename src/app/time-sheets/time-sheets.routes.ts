import { IRoutes } from '../../shared/shared.dev.models'
import {APP_ROUTES} from '../../app.routes'

export const TIME_SHEETS_ROUTES: IRoutes = Object.freeze({
    timeSheets: {
        path: '/time-sheets',
        subRouting: {
            item: {
                path: '/:id',
            },
            status: {
                path: '/statuses'
            }
        }
    }
})

export const TIME_SHEETS_ENDPOINT = `${APP_ROUTES.api.path}${TIME_SHEETS_ROUTES.timeSheets.path}`
export const TIME_SHEETS_SUBROUTING = TIME_SHEETS_ROUTES.timeSheets.subRouting
export const TIME_SHEETS_ITEM_ENDPOINT = `${TIME_SHEETS_SUBROUTING.item.path}`
export const TIME_SHEETS_ITEM_STATUS_ENDPOINT = `${TIME_SHEETS_SUBROUTING.status.path}`
