import { differenceInDays, subDays } from 'date-fns'

import { formatDateToFilter } from '../../utils'

function useBuildFilters() {
  const getStatementValue = (filter: any, daysDifference?: number) => {

    if (filter.subject === 'order_date' || filter.subject === 'max_shipping_date') {
      const date = filter.object

      if (daysDifference === undefined) {
        if (filter.verb === 'between') {
          const from = formatDateToFilter(date.from, 'AM')
          const to = date.to ? formatDateToFilter(date.to, 'PM') : formatDateToFilter(new Date(), 'PM')

          return {
            from,
            to
          }
        } else {
          return formatDateToFilter(date, 'AM')
        }
      } else {
        if (filter.verb === 'between') {
          const dateDiff = differenceInDays(date.from, date.to ?? new Date())
          const dateSub = subDays(date.to, daysDifference)

          const from = dateDiff > daysDifference ? formatDateToFilter(dateSub, 'AM') : formatDateToFilter(date.from, 'AM')
          const to = date.to ? formatDateToFilter(date.to, 'PM') : formatDateToFilter(new Date(), 'PM')

          return {
            from,
            to
          }
        } else {
          const dateDiff = differenceInDays(filter.object, new Date())
          const dateSub = subDays(date, daysDifference)

          return dateDiff > daysDifference ? formatDateToFilter(dateSub, 'AM') : formatDateToFilter(date, 'AM')
        }
      }
    }

    return filter.object
  }

  const buildFilters = (filterStatements: Array<any>, daysDifference?: number): Array<string> => {
    const filters: Array<string> = []

    filterStatements.map((filter: any) => {
      const statementValue = getStatementValue(filter, daysDifference)

      switch (filter.verb) {
        case '!=':
          filters.push(`${filter.subject}<>${statementValue}`)
          break;
        case 'contains':
          filters.push(`${filter.subject}=*${statementValue}*`)
          break;
        case 'between':
          filters.push(`${filter.subject} between "${statementValue.from}" AND "${statementValue.to}"`)
          break;
        default:
          filters.push(`${filter.subject}="${statementValue}"`)
          break;
      }
    })

    return filters
  }

  return [buildFilters]
}

export default useBuildFilters
