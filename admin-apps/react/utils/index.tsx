import React from 'react'
import { format } from 'date-fns'
import { FormattedCurrency } from 'vtex.format-currency'

import type { IOrderStatus } from './constants'
import { orderStatus } from './constants'

export const getOrderStatusDisplayName = (status: string): string => {
  const displayName = orderStatus.find((item: IOrderStatus) => item.status === status)

  return displayName?.name ?? status
}

export const formatDate = (date: string | Date): string => format(new Date(date), 'dd/MM/yyyy - HH:mm:ss')

export const formatDateToFilter = (date: string | Date, noon: 'AM' | 'PM'): string => {
  return `${format(new Date(date), 'MM/dd/yyyy')} ${noon === 'AM' ? '0:00:00' : '23:59:59'} ${noon}`
}

export const formatDocument = (document: string): string => document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

export const formatPhone = (phone: string): string => {
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (phone.length === 9) {
    return phone.replace(/(\d{5})(\d{4})/, '$1-$2')
  }

  return phone
}

export const getFullAdrress = (address: any): string => {
  const hasComplement = address.complement !== '' ? `${address.complement},` : ''
  return `${address.street}, ${address.number}, ${hasComplement} ${address.neighborhood}, ${address.city} - ${address.state}`
}

export const formatPrice = (value: number) => {
  const total = (value / 100)
  return <FormattedCurrency key={Math.random() * 100} value={total} />
}
