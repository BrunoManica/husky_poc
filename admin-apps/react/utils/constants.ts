export interface IOrderStatus {
  status: string,
  name: string
}

export const orderStatus: IOrderStatus[] = [
  {
    status: 'order-created',
    name: 'Processando'
  },
  {
    status: 'on-order-completed',
    name: 'Processando'
  },
  {
    status: 'payment-pending',
    name: 'Pagamento Pendente'
  },
  {
    status: 'waiting-for-order-authorization',
    name: 'Aguardando Autorização do Pedido'
  },
  {
    status: 'approve-payment',
    name: 'Preparando entrega'
  },
  {
    status: 'payment-approved',
    name: 'Pagamento Aprovado'
  },
  {
    status: 'payment-denied',
    name: 'Pagamento Negado'
  },
  {
    status: 'request-cancel',
    name: 'Solicitar cancelamento'
  },
  {
    status: 'waiting-for-seller-decision',
    name: 'Aguardando decisão do Seller'
  },
  {
    status: 'authorize-fulfillment',
    name: 'Aguardando autorização para despachar'
  },
  {
    status: 'order-create-error',
    name: 'Erro na criação do pedido'
  },
  {
    status: 'order-creation-error',
    name: 'Erro na criação do pedido'
  },
  {
    status: 'window-to-cancel',
    name: 'Carência para Cancelamento'
  },
  {
    status: 'ready-for-handling',
    name: 'Pronto para o Manuseio'
  },
  {
    status: 'start-handling',
    name: 'Iniciar Manuseio'
  },
  {
    status: 'handling',
    name: 'Preparando Entrega'
  },
  {
    status: 'invoice-after-cancellation-deny',
    name: 'Fatura pós-cancelamento negado'
  },
  {
    status: 'order-accepted',
    name: 'Verificando Envio'
  },
  {
    status: 'invoice',
    name: 'Enviando'
  },
  {
    status: 'invoiced',
    name: 'Faturado'
  },
  {
    status: 'replaced',
    name: 'Substituído'
  },
  {
    status: 'cancellation-requested',
    name: 'Cancelamento solicitado'
  },
  {
    status: 'cancel',
    name: 'Cancelar'
  },
  {
    status: 'canceled',
    name: 'Cancelado'
  }
]
