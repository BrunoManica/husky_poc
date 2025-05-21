import axios from 'axios';
//import { ProductVtex } from '../../../types/Product';
import { ComplementIdEnum, NewComplement, SKU, SkuComplement, SkuComplementVtex, SkuVtex } from '../../../types/Sku';
import { getSkuComplementsFromVtex } from '../FindProductAndskuByRefid/FindProductAndskuByRefid';
import { ProductUpdated } from '../../../types/Product';


export async function saveSkuInformation(skuVtex: SkuVtex): Promise<void> {
  const complements = await getSkuComplementsFromVtex(skuVtex.Id)
  await removeAllComplements(complements!!)
  await saveNewComplements(skuVtex)
}

async function removeAllComplements(skuComplements: SkuComplementVtex[]): Promise<void> {
  const removalPromises = skuComplements.map(complement => removeComplementById(complement.Id));
  await Promise.all(removalPromises);
}

async function removeComplementById(skuComplementId: number) {
  try {
    await axios.delete(`/api/catalog/pvt/skucomplement/${skuComplementId}`);
  } catch (error) {
    handleError(error);
  }
}

export async function saveSku(skuVtex: SKU): Promise<void> {
  try {
    await axios.put(`/api/catalog/pvt/stockkeepingunit/${skuVtex.id}`, skuVtex)
  } catch (error) {
    console.log(error);
  }
}

async function saveNewComplements(skuVtex: SkuVtex): Promise<void> {
  const similarProduct = transformComplements(skuVtex.similarProduct ?? [], ComplementIdEnum.SIMILAR_PRODUCT)
  const showTogether = transformComplements(skuVtex.showTogether ?? [], ComplementIdEnum.SHOW_TOGETHER)

  delete skuVtex.similarProduct;
  delete skuVtex.showTogether;

  const complements = similarProduct.concat(showTogether);
  const savePromises = complements.map(complement => saveComplement(mapNewComplement(skuVtex.Id, complement)));
  await Promise.all(savePromises);
}

function transformComplements(complements: SkuComplement[], typeId: ComplementIdEnum): SkuComplement[] {
  return complements.map(complement => ({
    name: complement.name,
    SkuId: complement.SkuId,
    ComplementTypeId: typeId,
  }))
}


function mapNewComplement(paarentSkuId: number, complement: SkuComplement): NewComplement {
  return {
    ParentSkuId: paarentSkuId,
    SkuId: complement.SkuId,
    ComplementTypeId: complement.ComplementTypeId
  }
}

async function saveComplement(complement: NewComplement) {
  try {
    await axios.post(`/api/catalog/pvt/skucomplement`, complement);
  } catch (error) {
    handleError(error);
  }
}

export async function saveProduct(productVtex: ProductUpdated): Promise<ProductUpdated | null> {
  try {
    const updateProduct = await axios.put(`/api/catalog/pvt/product/${productVtex.Id}`, productVtex);
    return updateProduct.data;
  } catch (error) {
    return null
  }
}

function handleError(error: any): void {
  console.error(error?.response?.data || error.message);
  throw error;
}

