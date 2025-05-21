import React, { useState } from 'react'
import { Button } from 'vtex.styleguide'

import useBuildFilters from '../../hooks/useBuildFilters'
import useSaveAsExcel from '../../hooks/useSaveAsExcel'
import { formatParams } from '../TableResult/utils'

interface IDataReport {
  filterStatements?: any
}

// const getFilterByField = (filters: Array<string>, field: string) => {
//   return filters.map((item: any, index: number) => {
//     if (item.includes(field)) {
//       const date = item.split('=')[1]

//       return {
//         index,
//         date
//       }
//     }

//     return false
//   })
// }

function DataReport({ filterStatements }: IDataReport) {
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [buildFilters] = useBuildFilters()
  const [saveAsExcel] = useSaveAsExcel()

  const fetchData = async (token?: string | null) => {
    const config = {
      headers: {
        'Accept': 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json'
      }
    }

    let url = '/api/dataentities/NF/scroll?_size=1000&_fields=_all'
    // let url = '/api/dataentities/OL/search?_fields=_all'
    debugger
    if (filterStatements.length && token === undefined) {
      // const order_date = getFilterByField(filters, 'order_date')
      // const max_shipping_date = getFilterByField(filters, 'max_shipping_date')

      // console.log([order_date, max_shipping_date])

      const filters = buildFilters(filterStatements)
      const formatedFilters = formatParams(filters)
      console.log('filters', formatedFilters)
      url += `&_where=(${formatedFilters.join(' AND ')})`
    } else if (token !== undefined) {
      url += `&_token=${token}`
    }

    console.log(url)
    return fetch(url, config)
      .then(async (response: any) => {
        return {
          data: await response.json(),
          token: response.headers.get('x-vtex-md-token')
        }
      })
  }

  const scrollOrders = async () => {
    // await fetchData()
    // return false

    const { data, token } = await fetchData()

    let isDataEmpty = !data.length

    if (token === null || isDataEmpty) {
      return false
    }

    const documents = []
    documents.push(data)

    do {
      const { data } = await fetchData(token)

      if (data.length) {
        documents.push(data)
      } else {
        isDataEmpty = true
      }
    } while (!isDataEmpty)

    const allDocuments = [].concat.apply([], documents)
    return allDocuments
  }

  const handleClick = async () => {
    setError(false)
    setLoading(true)

    const orders = await scrollOrders()
    if (orders) {
      saveAsExcel(orders)
    } else {
      setError(true)
    }

    setLoading(false)
  }

  return (
    <div className="mt6 mb6" style={{ display: 'flex', flexFlow: 'column', alignItems: 'flex-end' }}>
      <Button variation="primary" onClick={handleClick} isLoading={loading}>Gerar Relatório</Button>

      {error &&
        <p style={{ marginTop: '6px', marginBottom: '0', color: '#a7022a' }}>Houve um problema! Tente novamente mais tarde.</p>
      }
    </div>
  )
}

export default DataReport
