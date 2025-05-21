import React, { FC } from 'react';
import SkuModal from './components/SkuModal';
import { SKUCollectionItem } from '../../types/Sku';

const previewSku = [
    { name: "imagem", type: "images", "vtexField": "images" },
    { name: "nome sku", type: "textArea", "vtexField": "name" },
    { name: "sku ativo ?", type: "Toggle", vtexField: "isActive" },
    { name: "código de referência", type: "textArea", "vtexField": "refId" },
    { name: "kit ?", type: "Toggle", "vtexField": "isKit" },
    { name: "ean", type: "textArea", "vtexField": "ean" },
    { name: "multiplicador de unidade", type: "textArea", "vtexField": "unitMultiplier" },
    { name: "modal", type: "select", "vtexField": "modalType" },
    { name: "unidade de medida", type: "selectUnit", vtexField: "measurementUnit" },
    { name: "mostrar junto", type: "showTogether", vtexField: "showTogether" },
    { name: "produto similares", type: "similarProduct", vtexField: "similarProduct" },
]

interface SkuDetailsProps {
    skuPreview?: {
        skus: SKUCollectionItem[];
    };
}
const SkuDetailsComponent: FC<SkuDetailsProps> = ({ skuPreview }) => {
    return skuPreview ? (
        <div>
            <p className="t-action--large mw9">Cadastro de SKU</p>
            <div>
                {skuPreview.skus.map((skuDetail: SKUCollectionItem, index) => (
                    skuDetail && <SkuModal key={index} valuesVtex={skuDetail} fieldsToChange={previewSku} />
                ))}
            </div>
        </div>
    ) : null;
};

export default SkuDetailsComponent;
