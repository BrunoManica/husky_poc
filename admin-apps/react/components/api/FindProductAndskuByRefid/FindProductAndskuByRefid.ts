import axios, { AxiosResponse } from 'axios';
import { ProductVtex } from '../../../types/Product';
import { ProductAndSku } from '../../../types/ProductAndSku';
import { ComplementIdEnum, SimpleSkuInfo, SkuComplement, SkuComplementVtex, skuComplements as SkuComplements, SkuVtex } from '../../../types/Sku';
export async function findProductAndskuByRefid(refId: string): Promise<ProductAndSku | null> {
  const sku = await getSkuByRefId(refId);

  if (!sku) return logErrorAndReturnNull("SKU não encontrado");

  // const complements = await getSkuComplements(sku.Id);
  // sku.similarProduct = complements.similarProduct
  // sku.showTogether = complements.showTogether
  const product = await getProduct(sku.RefId)
  if (!product) return logErrorAndReturnNull("Produto não encontrado");
  const skuDetails = await getSkusByProductId(product.id)
  return mapProductSku(product, sku, skuDetails)
}

async function getSkusByProductId(productId: string): Promise<any> {
  const skus: SkuVtex[] = []
  try {
    const { data } = await axios.get(`/api/catalog_system/pub/products/variations/${productId}`)
    if (data) {
      data.skus.map(async (el: SkuVtex) => {
        skus.push(el)
      })
    }
    return skus
  } catch (error) {
    return null
  }
}


async function getSkuByRefId(refId: string): Promise<SkuVtex | null> {
  try {
    const responseSku: AxiosResponse<SkuVtex> = await axios.get(`/api/catalog/pvt/stockkeepingunit`, { params: { refId: refId } });
    return responseSku?.data
  } catch (error) {
    return null
  }
}


export async function getSkuComplements(SkuId: string): Promise<SkuComplements> {
  const complements = await getSkuComplementsFromVtex(Number(SkuId))
  const similarProduct: SkuComplement[] = []
  const showTogether: SkuComplement[] = []

  const skuPromises = complements!!.map(complement => getSimpleSku(null, complement.SkuId));
  const simpleSkus = await Promise.all(skuPromises);

  simpleSkus.forEach((simpleSku, index) => {
    const complement = complements!![index];

    const mappedComplement = mapComplement(simpleSku, complement)

    if (complement.ComplementTypeId === ComplementIdEnum.SIMILAR_PRODUCT) {
      similarProduct.push(mappedComplement);
    } else if (complement.ComplementTypeId === ComplementIdEnum.SHOW_TOGETHER) {
      showTogether.push(mappedComplement);
    }
  });

  return {
    similarProduct,
    showTogether
  }
}

export async function updateSkuEanVtex(skuId: string, ean: string): Promise<void> {
  try {
    await axios.delete(`/api/catalog/pvt/stockkeepingunit/${skuId}/ean/`);
    await axios.post(`/api/catalog/pvt/stockkeepingunit/${skuId}/ean/${ean}`);

  } catch (error) {
    console.log(error);
  }
}

export async function updateComplements(skuId: string, complements: SimpleSkuInfo[]) {
  try {
    const mappedComplements = mapUpdateComplements(complements, skuId)
    const responseSku: AxiosResponse<SkuComplementVtex[]> = await axios.post(`/api/catalog/pvt/skucomplement`, ...mappedComplements);
    return responseSku.data
  } catch (error) {
    console.log(error, typeof(error));
    return null
  }
}

export async function deleteComplement(skuId: string, selectedItem: string) {
  try {
    const { data }: AxiosResponse<SkuComplementVtex[]> = await axios.get(`/api/catalog/pvt/stockkeepingunit/${skuId}/complement`);

    if (!data) return;

    const complementToDelete = mapDeleteComplements(data, selectedItem)

    if (!complementToDelete) return;

    const { data: DataDelete }: AxiosResponse<SkuComplementVtex[]> = await axios.delete(`/api/catalog/pvt/skucomplement/${complementToDelete.Id}`);
    return DataDelete
  } catch (error) {
    console.log(error)
    return null
  }
}


export async function getSkuComplementsFromVtex(skuId: number): Promise<SkuComplementVtex[] | null> {
  try {
    const responseSku: AxiosResponse<SkuComplementVtex[]> = await axios.get(`/api/catalog/pvt/stockkeepingunit/${skuId}/complement`);
    return responseSku.data
  } catch (error) {
    return null
  }
}

export async function getSimpleSku(refId: string | null, SkuId: number | null): Promise<SimpleSkuInfo> {
  const sku = refId ? await getSkuByRefId(refId) : await getSkuById(SkuId!!)

  return {
    name: sku!!.Name,
    SkuId: sku!!.Id.toString(),
    ComplementTypeId: null
  }
}

function mapDeleteComplements(complements: SkuComplementVtex[], skuId: string): SkuComplementVtex | undefined {
  console.log(skuId)
  const complementToDelete = complements.find((complement) => complement.SkuId.toString() === skuId)
  if (!complementToDelete) return;
  return complementToDelete;
}

function mapUpdateComplements(complements: SimpleSkuInfo[], skuId: string) {
  const combinedComplements = [
    ...complements
  ];
  console.log(combinedComplements)
  const updatedComplements = combinedComplements.map((combinedComplement) => {
    const { name, ...rest } = combinedComplement;

    return {
      ...rest,
      ParentSkuId: Number(skuId)
    };
  });
  return updatedComplements;
}

function mapComplement(simpleSku: SimpleSkuInfo, complement: SkuComplementVtex): SkuComplement {
  return {
    name: simpleSku.name!,
    SkuId: simpleSku.SkuId.toString(),
    ComplementTypeId: complement.ComplementTypeId
  };
}


async function getSkuById(id: number): Promise<SkuVtex | null> {
  try {
    const responseSku: AxiosResponse<SkuVtex> = await axios.get(`/api/catalog/pvt/stockkeepingunit/${id}`);

    return responseSku?.data ?? null
  } catch (error) {
    return null
  }
}

async function getProduct(idProduct: string): Promise<ProductVtex | null> {
  try {
    const response: AxiosResponse<ProductVtex> = await axios.get(`/api/catalog_system/pvt/products/productgetbyrefid/${idProduct}`);

    return response?.data ?? null

  } catch (error) {
    return null
  }
}

function mapProductSku(productVtex: ProductVtex, skuVtex: SkuVtex, skuDetail: any): ProductAndSku {
  return {
    productVtex: productVtex,
    skuVtex: skuVtex,
    skuDetail: skuDetail
  }
}

function logErrorAndReturnNull(message: string): null {
  console.error(message);
  return null;
}

// function handleError(error: any): void {
//   console.error(error?.response?.data || error.message);
//   throw error;
// }