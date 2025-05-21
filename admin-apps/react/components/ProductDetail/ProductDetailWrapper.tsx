import React, { FC, useState, useCallback, useEffect } from 'react';
import { useLazyQuery } from 'react-apollo';
import { PageBlock, Alert } from 'vtex.styleguide';
import InputSearchComponent from './components/InputSearchComponent/InputSearchComponent';
import ProductDetailsComponent from './components/ProductDetailsComponent/ProductDetailsComponent';
import SkuDetailsComponent from '../SkuDetails/SkuDetails';
import SpinnerComponent from './components/SpinnerComponent/SpinnerComponent';
import ErrorComponent from './components/ErrorComponent/ErrorComponent';
import PRODUCT from "../../graphql/getProduct.gql";
import PRODUCT_FIELDS from "../../graphql/getProductFields.gql";
import { CollectionProduct } from '../../types/Sku';
import { saveProduct } from '../api/UpdateProductAndSku/UpdateProductAndSku';
import { ProductUpdated, ProductVtex } from '../../types/Product';
import { ProductPreviewHeader } from '../../types/ProductAndSku';
import mappedroductFields from "../api/mapProductFields/mapProductFields"

enum handleStates {
  ISINITIAL = 0,
  ISLOADING = 1,
  ISERROR = 2,
  ISSUCCESS = 3,
  ISSEARCHAGAIN = 4,
}

const ProductDetailWrapper: FC = () => {
  const [searchRefId, setSearchRefId] = useState<string>('');
  const [productSearch, setProductSearch] = useState<ProductVtex | undefined>(undefined);
  const [tableHeadersProduct, setTableHeadersProduct] = useState<ProductPreviewHeader[]>([]);
  const [skuPreview, setSkuPreview] = useState<CollectionProduct | undefined>(undefined);
  const [appState, setAppState] = useState(handleStates.ISINITIAL);
  const [hasError, setHasError] = useState(false);
  const [response, setResponse] = useState<ProductUpdated | null>(null);
  const [close, setClose] = useState(false);
  const [closeError, setCloseError] = useState(false);
  
  const [products, { loading: loadingProduct, data: dataProduct, error: errorProduct }] = useLazyQuery(PRODUCT, {
    fetchPolicy: 'network-only',
  });

  const [productFields, { loading: loadingFields, data: dataFields, error: errorFields }] = useLazyQuery(PRODUCT_FIELDS, {
    fetchPolicy: 'network-only',
  });
  console.log(productSearch)
  useEffect(() => {
    if (close) {
      const timer = setTimeout(() => {
        setClose(false)
      }, 2000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [close]);

  const resetStates = useCallback(() => {
    setAppState(handleStates.ISSEARCHAGAIN);
    setTableHeadersProduct([]);
    setProductSearch(undefined);
    setSkuPreview(undefined);
    setHasError(false);
    setResponse(null);
  }, []);

  const fetchProductData = useCallback(() => {
    if (!searchRefId) return;

    setAppState(handleStates.ISLOADING);
    setHasError(false);

    products({ variables: { term: searchRefId } });
    productFields({
      variables: {
        identifier: {
          field: 'refId',
          value: searchRefId,
        },
      },
    });
  }, [searchRefId, products, productFields]);

  useEffect(() => {
    if (dataProduct) {
      setTableHeaders(dataProduct?.products.items[0]);
      setSkuPreview(dataProduct?.products?.items.find((el: any) => el?.ref === searchRefId) || null);
      setAppState(handleStates.ISSUCCESS);
    }

    if (dataFields) {
      console.log(dataFields)
      setProductSearch(dataFields);
    }

    if ((errorProduct || errorFields) && !dataProduct && !dataFields) {
      setAppState(handleStates.ISERROR);
      setHasError(true);
    }
  }, [dataProduct, errorProduct, errorFields, dataFields, searchRefId]);

  const setTableHeaders = useCallback((dados) => {
    if (!dados) return;
    const tableHeadersAux: ProductPreviewHeader[] = [
      {
        refId: dados.ref,
        id: dados.id,
        name: dados.name,
      },
    ];
    setTableHeadersProduct(tableHeadersAux);
  }, []);

  const updateProduct = useCallback(async (updatedProduct: any) => {
    try {
      const mappedProduct = mappedroductFields(updatedProduct);
      console.log(mappedProduct, ">> Dados atualizados para envio");
      const response = await saveProduct(mappedProduct);
      setResponse(response);
      setClose(true);
      resetStates();
    } catch (error) {
      console.error(error);
      setAppState(handleStates.ISERROR);
      setHasError(true);
    }
  }, [resetStates]);

  return (
    <PageBlock fullWidth>      <InputSearchComponent
      searchRefId={searchRefId}
      setSearchRefId={setSearchRefId}
      resetStates={resetStates}
      fetchProductData={fetchProductData}
    />
      {close && (
        <Alert type="success" onClose={() => setClose(false)}>
          Seu produto {response?.Name} foi atualizado com sucesso.
        </Alert>
      )}
      {closeError && (
        <Alert type="error" onClose={() => setCloseError(false)}>
          Erro ao atualizar o item {response?.Name}.
        </Alert>
      )}
      {dataFields && appState === handleStates.ISSUCCESS && (
        <>
          <ProductDetailsComponent tableHeadersProduct={tableHeadersProduct} dataFields={dataFields} updateProduct={updateProduct} />

          <SkuDetailsComponent skuPreview={skuPreview} />
        </>
      )}

      {(loadingProduct || loadingFields) &&
        <PageBlock>
          <SpinnerComponent />
        </PageBlock>}

      {hasError && <ErrorComponent resetStates={resetStates} />}
    </PageBlock>
  );
};

export default ProductDetailWrapper;
