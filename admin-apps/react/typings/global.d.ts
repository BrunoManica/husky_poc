import { FunctionComponent } from 'react'

declare global {
  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object
    getSchema?(props?: P): object
  }

  interface IOrderMiles {
    milesToAcumulate: number
    priceInCash: number
    priceInMiles: number
    type: string
  }
}
