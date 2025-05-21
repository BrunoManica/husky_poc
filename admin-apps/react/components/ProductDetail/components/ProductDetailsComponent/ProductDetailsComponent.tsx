import React, { FC, useState } from 'react';
import { PageBlock, Button } from 'vtex.styleguide';
import ProductDetailsTable from '../productDetailsTable';
import DinamicForm from '../DinamicForm';
import { ProductPreviewHeader } from '../../../../types/ProductAndSku';
const FieldsProduct = [
  { name: "Produto ativo ?", type: "Toggle", vtexField: "isActive" },
  { name: "Exibe no site", type: "Toggle", vtexField: "isVisible" },
  { name: "Mostrar sem estoque", type: "Toggle", vtexField: "showWithoutStock" },
  { name: "Text Link", type: "TextField", vtexField: "linkId" },
  { name: "Descrição do produto", type: "TextArea", vtexField: "description" },
  { name: "Data de lançamento no mercado", type: "DatePicker", vtexField: "releaseDate" },
  { name: "Palavras similares", type: "TextArea", vtexField: "keywords" },
  { name: "Descrição (Meta tag description)", type: "TextArea", vtexField: "metaTagDescription" },
  { name: "Canais de venda", type: "CheckboxGroup", vtexField: "salesChannel" },
  { name: "Código de referência", type: "TextField", vtexField: "refId" },
  { name: "Nome do produto", type: "TextField", vtexField: "name" },
  { name: "ID do departamento", type: "TextField", vtexField: "departmentId" },
  { name: "ID da categoria", type: "TextField", vtexField: "categoryId" },
  { name: "ID da marca", type: "TextField", vtexField: "brandId" },
  { name: "Código fiscal", type: "TextField", vtexField: "TaxCode" },
  { name: "ID do fornecedor", type: "TextField", vtexField: "supplierId" }
  // { name: "Código de remarketing do AdWords", type: "TextField", vtexField: "AdWordsRemarketingCode" },
  // { name: "Código da campanha Lomadee", type: "TextField", vtexField: "LomadeeCampaignCode" }
];
interface ProductDetailsProps {
  tableHeadersProduct: ProductPreviewHeader[];
  dataFields: any;
  updateProduct: (updatedProduct: any) => void;
}

const ProductDetailsComponent: FC<ProductDetailsProps> = ({ tableHeadersProduct, dataFields, updateProduct }) => {
  const [updatedDataFields, setUpdatedDataFields] = useState(dataFields.product);

  const handleFormChange = (updatedValues: any) => {
    setUpdatedDataFields(updatedValues);
  };

  return (
    <PageBlock>
      <ProductDetailsTable productInformationTable={tableHeadersProduct} />
      <div>
        <p className="t-action--large mw9">Cadastro de Produto</p>
        <DinamicForm
          fieldsToChange={FieldsProduct}
          valuesVtex={dataFields?.product}
          onChange={handleFormChange}
        />
      </div>
      <Button variation="primary" onClick={() => updateProduct(updatedDataFields)}>
        Atualizar
      </Button>
    </PageBlock>
  );
};

export default ProductDetailsComponent;
