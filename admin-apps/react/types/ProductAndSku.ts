import { ProductVtex } from "./Product"
import { SkuDetail, SkuVtex } from "./Sku"

export type ProductAndSku = {
    productVtex: ProductVtex,
    skuVtex: SkuVtex,
    skuDetail: SkuDetail[]
}
export type ProductPreviewHeader = {
    refId: string,
    id: string,
    name: string
}
export type ProductInformationTable = {
    refId: string,
    productId: number,
    skuId: number,
    name: string
}

