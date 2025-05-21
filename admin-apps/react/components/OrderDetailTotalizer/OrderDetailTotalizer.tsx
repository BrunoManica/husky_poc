import React from 'react'

import { formatPrice } from '../../utils'

interface IOrderDetailTotalizer {
  miles: IOrderMiles | null
  orderFormValue: number
}

function OrderDetailTotalizer({ miles, orderFormValue }: IOrderDetailTotalizer) {
  if (miles === null) {
    return (
      <tr>
        <th>Total pago:</th>
        <td>{formatPrice(orderFormValue)}</td>
      </tr>
    )
  }

  let total: any = 0

  switch (miles.type) {
    case 'Smiles & Money':
      total = [formatPrice(miles.priceInCash), ` & ${miles.priceInMiles} milhas`]
      break
    case 'Money':
      total = formatPrice(miles.priceInCash)
      break
    default:
      total = `${miles.priceInMiles} milhas`
      break
  }

  return (
    <>
      <tr>
        <th>Total pago:</th>
        <td>{total}</td>
      </tr>
      <tr>
        <th>Milhas acumuladas:</th>
        <td>{miles.milesToAcumulate}</td>
      </tr>
      {/* <tr>
        <th>Milhas bônus:</th>
        <td>null</td>
      </tr> */}
    </>
  )
}

export default OrderDetailTotalizer
