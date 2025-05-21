import React from 'react'
import { addBusinessDays } from 'date-fns'

import {
  Table,
  Totalizer
} from 'vtex.styleguide'

import OrderDetailTotalizer from '../OrderDetailTotalizer'
import Timeline from '../Timeline'
import TimelineItem from '../TimelineItem'
// import OrderReversal from '../OrderReversal'

import useDecryptedEmail from '../../hooks/useDecryptedEmail'
import { formatPrice } from '../../utils'

import {
  getOrderStatusDisplayName,
  getFullAdrress,
  formatDate,
  formatDocument,
  formatPhone
} from '../../utils'

interface IOrderDetail {
  order: any
  tracking: any
}

const itensSchema = {
  properties: {
    quantity: {
      title: 'Qtd',
      width: 50
    },
    description: {
      title: 'Descrição do produto',
      width: 350
    },
    totalMiles: {
      title: 'Valor pago em milhas'
    },
    discount: {
      title: 'Desconto concedido'
    },
    totalPrice: {
      title: 'Valor pago em reais'
    },
    installments: {
      title: 'Parcelas da compra'
    },
    unitValue: {
      title: 'Valor unitário'
    }
  },
}

const getOrderMiles = (sellerId: string, customData: any): IOrderMiles | null => {
  if (customData === null) {
    return null
  }

  const items = JSON.parse(customData.customApps[0].fields.items)
  const item = items.find((item: any) => item.sellerId === sellerId)

  const {
    milesToAcumulate,
    priceInCash,
    priceInMiles,
    type
  } = item.payment

  return {
    milesToAcumulate,
    priceInCash,
    priceInMiles,
    type
  }
}

const getOrderShipping = (sellerId: string, customData: any): Omit<IOrderMiles, 'milesToAcumulate'> | null => {
  if (customData === null) {
    return null
  }

  const items = JSON.parse(customData.customApps[0].fields.items)
  const item = items.find((item: any) => item.sellerId === sellerId)

  const {
    priceInCash,
    priceInMiles,
    type
  } = item.shippingPayment[0]

  return {
    priceInCash,
    priceInMiles,
    type
  }
}

const getShipmentEstimateDate = (createdDate: string, shippingData: any): string => {
  const {
    shippingEstimate,
    shippingEstimateDate
  } = shippingData.logisticsInfo[0]

  let estimateDate: string

  if (shippingEstimateDate === null) {
    const bd = shippingEstimate.replace(/\D/g, '')
    estimateDate = formatDate(String(addBusinessDays(new Date(createdDate), bd)))
  } else {
    estimateDate = formatDate(shippingData.logisticsInfo[0].shippingEstimateDate)
  }

  return estimateDate
}

const getShippingValue = (shippingData: any, shippingPrice: number) => {
  if (shippingData === null) {
    return (
      <>
        {formatPrice(shippingPrice)}
      </>
    )
  }

  let total: any = 0

  switch (shippingData.type) {
    case 'Smiles & Money':
      total = shippingData.priceInCash > 0 && shippingData.priceInMiles > 0 ? [formatPrice(shippingData.priceInCash), ` & ${shippingData.priceInMiles} milhas`] : 'Grátis'
      break
    case 'Money':
      total = shippingData.priceInCash > 0 ? formatPrice(shippingData.priceInCash) : 'Grátis'
      break
    default:
      total = shippingData.priceInMiles > 0 ? `${shippingData.priceInMiles} milhas` : 'Grátis'
      break
  }

  return (
    <>
      {total}
    </>
  )
}

const orderItemsToTable = (items: any, customData: any) => {
  const hasCustomData = customData !== null ? true : false

  let totalMiles: number = 0,
    totalPrice: number | JSX.Element = 0,
    discount: number | JSX.Element = 0

  return items.map((item: any) => {
    if (hasCustomData) {
      const customDataItems = JSON.parse(customData.customApps[0].fields.items)
      const foundItemInCustomData = customDataItems.find((customDataItem: any) => customDataItem.skuId === item.id)

      totalMiles = foundItemInCustomData.payment.priceInMiles !== 0 ? foundItemInCustomData.payment.priceInMiles : 0

      const price = foundItemInCustomData.payment.priceInCash !== 0 ? foundItemInCustomData.payment.priceInCash : 0
      totalPrice = formatPrice(price)
    } else {
      totalMiles = 0
      totalPrice = formatPrice(item.sellingPrice)
      discount = formatPrice(item.price - item.sellingPrice)
    }

    return {
      quantity: item.quantity,
      description: item.name,
      totalMiles,
      discount,
      totalPrice,
      installments: 0,
      unitValue: formatPrice(item.price)
    }
  })
}

function OrderDetail({ order, tracking }: IOrderDetail): JSX.Element | null {
  const [decryptEmail] = useDecryptedEmail()

  if (order === null) {
    return null
  }

  const {
    clientProfileData,
    shippingData,
    customData,
    items
  } = order

  console.log(order)

  const miles = getOrderMiles(order.sellers[0].id, customData)
  const shipping = getOrderShipping(order.sellers[0].id, customData)
  const tableItems = orderItemsToTable(items, customData)
  // const isPaymentOnlyInMiles = miles?.priceInCash ? false : true

  return (
    <>
      <div style={{ borderBottom: '2px solid #FF7020' }}>
        <h2 className="mt0 mb2">Dados do Cliente</h2>
      </div>

      <div className="pt6 pb6 mb6">
        <table className="table-horizontal-heading">
          <tbody>
            <tr>
              <th>Nome do cliente:</th>
              <td>{clientProfileData.firstName} {clientProfileData.lastName}</td>
            </tr>
            <tr>
              <th>CPF:</th>
              <td>{formatDocument(clientProfileData.document)}</td>
            </tr>
            <tr>
              <th>Telefone:</th>
              <td>{formatPhone(clientProfileData.phone)}</td>
            </tr>
            <tr>
              <th>E-mail:</th>
              <td>{decryptEmail(clientProfileData.userProfileId, clientProfileData.email)}</td>
            </tr>
            <tr>
              <th>Endereço informado na compra:</th>
              <td>{getFullAdrress(shippingData.address)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt6" style={{ borderBottom: '2px solid #FF7020' }}>
        <h2 className="mt0 mb2">Dados do Pedido</h2>
      </div>

      <div className="pt6 pb6 mb6">
        <table className="table-horizontal-heading">
          <tbody>
            <tr>
              <th>Número do pedido:</th>
              <td>{order.orderId}</td>
            </tr>
            <tr>
              <th>Data e hora do Pedido:</th>
              <td>{formatDate(order.creationDate)}</td>
            </tr>
            <tr>
              <th>Fornecedor:</th>
              <td>{order.sellers[0].name}</td>
            </tr>
            <tr>
              <th>Situação do pedido:</th>
              <td>{order.statusDescription}</td>
            </tr>
            {order.status === "canceled" || order.status === "cancellation-requested" &&
              <tr>
                <th>Motivo da situação:</th>
                <td>{order.cancelReason ?? 'Não informado'}</td>
              </tr>
            }
            <tr>
              <th>Pedido fornecedor:</th>
              <td>{order.sellerOrderId}</td>
            </tr>

            <OrderDetailTotalizer miles={miles} orderFormValue={order.value} />

            {order.sellers[0].id !== '1' && // smiles
              <tr>
                <th>Prazo de entrega:</th>
                <td>{getShipmentEstimateDate(order.creationDate, shippingData)}</td>
              </tr>
            }

            {order.isCompleted &&
              <tr>
                <th>Data da finalização do pedido:</th>
                <td>{formatDate(order.lastChange)}</td>
              </tr>
            }
            {/* <tr>
              <th>Uso de voucher:</th>
              <td>null</td>
            </tr>
            <tr>
              <th>Campanha:</th>
              <td>null</td>
            </tr> */}
          </tbody>
        </table>
      </div>

      <div className="mt6" style={{ borderBottom: '2px solid #FF7020' }}>
        <h2 className="mt0 mb2">Itens do Pedido</h2>
      </div>

      <div className="mt6 mb6">
        <Table
          schema={itensSchema}
          items={tableItems}
          indexColumnLabel="Index"
        />
      </div>

      {/* <OrderReversal
        orderId={order.orderId}
        sellerId={order.sellers[0].id}
        createDate={order.creationDate}
        tracking={tracking}
        isPaymentOnlyInMiles={isPaymentOnlyInMiles}
      /> */}

      {!shippingData.logisticsInfo[0].pickupStoreInfo.isPickupStore &&
        <div className="pt4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Totalizer
            items={[
              {
                label: 'Frete',
                value: shippingData.logisticsInfo[0].selectedSla
              },
              {
                label: 'Valor do frete',
                value: getShippingValue(shipping, shippingData.logisticsInfo[0].price)
              }
            ]}
          />
        </div>
      }

      {shippingData.logisticsInfo[0].pickupStoreInfo.isPickupStore && order.status !== "canceled" &&
        <>
          <div className="mt6" style={{ borderBottom: '2px solid #FF7020' }}>
            <h2 className="mt0 mb2">Loja de Retirada</h2>
          </div>

          <div className="pt6 pb6 mb6">
            <table className="table-horizontal-heading">
              <tbody>
                <tr>
                  <th>Endereço:</th>
                  <td>{shippingData.logisticsInfo[0].pickupStoreInfo.address}</td>
                </tr>
                <tr>
                  <th>Local:</th>
                  <td>{shippingData.logisticsInfo[0].pickupStoreInfo.friendlyName}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      }

      <div className="mt6" style={{ borderBottom: '2px solid #FF7020' }}>
        <h2 className="mt0 mb2">Rastreamento do Pacote</h2>
      </div>

      <div className="pt6 pb6 mb6">
        <Timeline>
          {tracking?.statusTimeline?.map((status: any, i: number) => (
            <TimelineItem key={i * 2} date={formatDate(status.date)}>
              {getOrderStatusDisplayName(status.state)}
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </>
  )
}

export default OrderDetail
