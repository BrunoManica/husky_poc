import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import {
  Layout,
  PageBlock,
  PageHeader,
  Spinner
} from 'vtex.styleguide'

import OrderDetail from './components/OrderDetail'

import './styles.global.css'

interface Props {
  params: any
}

function OrderDetailWrapper({ params }: Props) {
  const { id: orderID } = params
  const { history } = useRuntime()

  const [orderDetail, setOrderDetail] = useState<any>(null)
  const [orderTracking, setOrderTracking] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchOrderDetail = async () => {
      await fetch(`/api/oms/pvt/orders/${orderID}`)
        .then(res => {
          return res.json()
        })
        .then(data => {
          setOrderDetail(data)
        })
    }

    const fetchOrderTracking = async () => {
      await fetch(`/api/oms/pvt/orders/${orderID}/workflow`)
        .then(res => {
          return res.json()
        })
        .then(data => {
          setOrderTracking(data)
        })
    }

    setLoading(true)
    fetchOrderDetail()
    fetchOrderTracking()
    setLoading(false)

    return () => {
      setOrderDetail(null)
      setOrderTracking(null)
    }
  }, [])

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={`Pedido #${orderID}`}
          linkLabel="Pedidos"
          onLinkClick={() => {
            history.goBack()
          }}
        />
      }
    >
      <PageBlock variation="full">
        {loading ?
          <Spinner />
          :
          <OrderDetail order={orderDetail} tracking={orderTracking} />
        }
      </PageBlock>
    </Layout>
  )
}

export default OrderDetailWrapper
