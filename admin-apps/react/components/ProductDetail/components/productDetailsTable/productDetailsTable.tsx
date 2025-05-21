
import React from 'react';
import { Table } from 'vtex.styleguide';
import { ProductPreviewHeader } from '../../../../types/ProductAndSku';
const productNotFoundLabel = "Produto não encontrado"

const tableHeadersSku = {
    properties: {
        refId: {
            title: "Id Material FSJ",
            width: 150,
            density: "high"
        },
        id: {
            title: "Id produto vtex",
            width: 150
        },
        name: {
            title: "Nome do material",
            width: 470
        }
    },
}

type Props = {
    productInformationTable: ProductPreviewHeader[]
}

const ProductDetailsTable = ({ productInformationTable }: Props) => {
    console.log(productInformationTable, "table")
    return (<Table
        schema={tableHeadersSku}
        items={productInformationTable}
        emptyStateLabel={productNotFoundLabel}
    />)
}

export default ProductDetailsTable;