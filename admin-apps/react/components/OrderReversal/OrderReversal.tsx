import React from 'react'
// import differenceInDays from 'date-fns/differenceInDays'
// import { Button } from 'vtex.styleguide'
// import { useLazyQuery } from 'react-apollo'
// import axios from 'axios'

// import QUERY_ACCESS_TOKEN from '../../graphql/getAccessToken.gql'
// import QUERY_RENEW_ACCESS_TOKEN from '../../graphql/renewAccessToken.gql'

// interface IOrderReversal {
//   orderId: string
//   sellerId: string
//   createDate: string
//   tracking: any
//   isPaymentOnlyInMiles: boolean
// }

// type ICallOrderReversal = (
//   isPaymentOnlyInMiles: boolean,
//   multiTransactionList: any,
//   token: string,
//   transactionId: string,
//   paymentId: string
// ) => Promise<boolean>

// const isPaymentApproved = (tracking: any) => {
//   return tracking?.statusTimeline.find((item: { data: string, state: string }) => item.state === 'payment-approved')
// }

// const isReversalExpired = (date: string): boolean => {
//   const days = differenceInDays(new Date(), new Date(date))

//   if (days > 44) {
//     return true
//   }

//   return false
// }

// const getMultiTransactionList = async (orderId: string, sellerId: string): Promise<any> => {
//   const id = orderId.split('-')[0]

//   return axios
//     .get(`/api/dataentities/vtex_smiles_payment_provider_md_multiTransaction/search?_fields=_all&_schema=0.0.2-ppftest&_where=orderId=${id}`)
//     .then(response => {
//       return response.data.find((item: any) => item.sellerId === sellerId)
//     })
//     .catch(() => {
//       return undefined
//     })
// }

// const getPspReference = async (transactionId: string, paymentId: string): Promise<string | undefined> => {
//   return axios
//     .get(`https://shoppingsmileshml.vtexpayments.com.br/api/pvt/transactions/${transactionId}}/payments`, {
//       headers: {
//         'X-VTEX-API-AppKey': 'vtexappkey-shoppingsmileshml-VYDJVG',
//         'X-VTEX-API-AppToken': 'CAELZPLRQXTAZIFTMKTDMFGAFVOPXPMHPZFTEGVNOJPQMYBPFOZPEHDXUDFEAWTALMKZDMOFPFPCQQOHTZKIPWDIWHZBARMRPOFANCMTATAYRAHDPYKBMLKOJCCVMNFX'
//       }
//     })
//     .then(response => {
//       const referenceItem = response.data.find((item: any) => item.id === paymentId)
//       return referenceItem?.connectorResponse.pspReference
//     })
//     .catch(() => {
//       return undefined
//     })
// }

// const callOrderReversal: ICallOrderReversal = async (isPaymentOnlyInMiles, multiTransactionList, token, transactionId, paymentId) => {
//   const endpoint = isPaymentOnlyInMiles
//     ? 'https://api-hml5-redeem-miles.smiles.com.br/v1/redeem/cancel'
//     : 'https://api-hml5-ckt-checkout.smiles.com.br/v1/refundpayment'

//   const normalizeTransactionList = multiTransactionList.result.transactionList?.map((item: any) => {
//     return {
//       itemId: item.itemId,
//       id: item.siebelTransactionId,
//       ...(!isPaymentOnlyInMiles) && {
//         accrualTransactionId: item.accrualTransactionId
//       }
//     }
//   })

//   const data = {
//     "orderId": multiTransactionList.result.orderId,
//     "partnerAlias": multiTransactionList.result.partnerAlias,
//     "transactionList": normalizeTransactionList,
//     ...(!isPaymentOnlyInMiles) && {
//       "accountType": "ShoppingSmiles",
//       "process": "SYNC",
//       "reference": await getPspReference(transactionId, paymentId),
//       "amount": {
//         "value": multiTransactionList.amountInMoney,
//         "currency": "BRL",
//       }
//     },
//   }

//   return await axios
//     .post(endpoint, data, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     })
//     .then(() => true)
//     .catch(() => false)
// }

// function OrderReversal({ orderId, sellerId, createDate, tracking, isPaymentOnlyInMiles }: IOrderReversal): JSX.Element | null {
function OrderReversal(): JSX.Element {
  // if (!isPaymentApproved(tracking) || isReversalExpired(createDate)) {
  //   return null
  // }

  // const [loading, setLoading] = useState<boolean>(false)
  // const [success, setSuccess] = useState<boolean>(false)
  // const [error, setError] = useState<boolean>(false)
  // const [multiTransactionList, setMultiTransactionList] = useState<any>({})

  // // const [getAccessToken, { data: dataAccessToken, error: errorAccessToken }] = useLazyQuery(QUERY_ACCESS_TOKEN, {
  // //   fetchPolicy: 'no-cache'
  // // })

  // // const [renewAccessToken, { data: dataRenewAccessToken, error: errorRenewAccessToken }] = useLazyQuery(QUERY_RENEW_ACCESS_TOKEN)
  // useEffect(() => {
  //   const handleOrderReversal = async () => {
  //     if (true) {
  //       const reversal = await callOrderReversal(
  //         isPaymentOnlyInMiles,
  //         multiTransactionList,
  //         "",
  //         multiTransactionList.transactionId,
  //         multiTransactionList.paymentId
  //       )

  //       if (reversal) {
  //         setSuccess(true)
  //         setError(false)
  //         setLoading(false)
  //       } else {
  //       }
  //     }
  //   }

  //   if (true) {
  //     setError(true)
  //     setLoading(false)
  //   } else {
  //     handleOrderReversal()
  //   }
  // }, [dataAccessToken, errorAccessToken])

  // useEffect(() => {
  //   const handleRenewedOrderReversal = async () => {
  //     if (dataRenewAccessToken) {
  //       const reversal = await callOrderReversal(
  //         isPaymentOnlyInMiles,
  //         multiTransactionList,
  //         dataRenewAccessToken.updateToken.access_token,
  //         multiTransactionList.transactionId,
  //         multiTransactionList.paymentId
  //       )

  //       if (reversal) {
  //         setSuccess(true)
  //         setError(false)
  //       } else {
  //         setError(true)
  //       }

  //       setLoading(false)
  //     }
  //   }

  //   if (errorRenewAccessToken) {
  //     setError(true)
  //     setLoading(false)
  //   } else {
  //     handleRenewedOrderReversal()
  //   }
  // }, [dataRenewAccessToken, errorRenewAccessToken])

  // const handleClick = async (): Promise<void> => {
  //   setError(false)
  //   setLoading(true)

  //   const list = await getMultiTransactionList(orderId, sellerId)
  //   console.log('list', list)
  //   console.log('result', list.result)

  //   if (list === undefined || list.result === undefined) {
  //     setError(true)
  //     setLoading(false)
  //     return
  //   }

  //   setMultiTransactionList(list)
  //   getAccessToken()
  // }

  return (
    <div className="mb6" style={{ display: 'flex', flexFlow: 'column', alignItems: 'flex-end' }}>
      order reversal
    </div>
  )
}

export default OrderReversal
