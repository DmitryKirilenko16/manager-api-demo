import { Between } from 'typeorm'
import { IDateFilter } from '../../shared.models'

export const getDateWhereFilterCondition = (filter: IDateFilter) => {
    return (filter?.startDate && filter?.endDate) ? {
        date: Between(filter.startDate, filter.endDate),
    } : {}
}
