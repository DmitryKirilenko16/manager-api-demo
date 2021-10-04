interface IMonthStartEndDates {
    firstDayDate: Date,
    lastDayDate: Date
}

export const getMonthStartEndDates = (originalDate: Date): IMonthStartEndDates => {
    const date = new Date(originalDate), y = date.getFullYear(), m = date.getMonth()
    const firstDayDate = new Date(y, m, 1)
    const lastDayDate = new Date(y, m + 1, 0)

    const [firstDayDateBegin, lastDayDateEnd] = setBeginAndEndOfTwoDates(firstDayDate, lastDayDate)

    return {
        firstDayDate: firstDayDateBegin,
        lastDayDate: lastDayDateEnd,
    }
}

export const setBeginAndEndOfTwoDates = (startDate: Date, endDate: Date): [Date, Date] => {
    const startDateCopy = new Date(startDate)
    const endDateCopy = new Date(endDate)

    startDateCopy.setHours(0, 0, 0, 0)
    endDateCopy.setHours(23, 59, 59, 999)

    return [startDateCopy, endDateCopy]
}
