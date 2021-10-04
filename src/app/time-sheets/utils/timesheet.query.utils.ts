import { TimeSheetItemEntity } from '../time-sheets.entity'

export class TimeSheetQueryUtils {
    static get timeSheetAccessibleFields(): (keyof TimeSheetItemEntity)[] {
        return [
            'id',
            'date',
            'hours',
            'taskDescription',
            'status',
            'user_id'
        ]
    }
}
