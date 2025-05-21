type measures = {
  cubicweight: number;
  height: number;
  length: number;
  weight: number;
  width: number
}
export type SkuDetail = {
  sku: number;
  skuname: string;
  available: boolean;
  availablequantity: number;
  cacheVersionUsedToCallCheckout: string;
  listPriceFormated: string
  listPrice: number;
  taxFormated: string;
  taxAsInt: number;
  bestPriceFormated: string;
  bestPrice: number;
  spotPrice: number;
  installments: number;
  installmentsValue: number;
  installmentsInsterestRate: number;
  image: string;
  sellerId: number;
  seller: string;
  measures: measures;
  unitMultiplier: number;
  rewardValue: number;
}

export type SkuVtex = {
  Id: number;
  ProductId: number;
  IsActive: boolean;
  ActivateIfPossible: boolean;
  Name: string;
  RefId: string;
  PackagedHeight: number;
  PackagedLength: number;
  PackagedWidth: number;
  PackagedWeightKg: number;
  Height: number;
  Length: number;
  Width: number;
  WeightKg: number;
  CubicWeight: number;
  IsKit: boolean;
  CreationDate: string;
  RewardValue: null | number;
  EstimatedDateArrival: string | null;
  ManufacturerCode: string | null;
  CommercialConditionId: number;
  MeasurementUnit: string;
  UnitMultiplier: number;
  ModalType: string | null;
  KitItensSellApart: boolean;
  Videos: string[];
  similarProduct?: SkuComplement[]
  showTogether?: SkuComplement[]
};

export type NewComplement = {
  ParentSkuId: number,
  SkuId: string,
  ComplementTypeId: number
}
export type FieldToChange = {
  name: string,
  type: string,
  vtexField: string
}
export type SkuComplement = {
  name: string,
  SkuId: string,
  ComplementTypeId: number
}

export type SkuComplementVtex = {
  Id: number;
  SkuId: number;
  ParentSkuId: number;
  ComplementTypeId: number;
};

export type SimpleSkuInfo = {
  SkuId: string | number; name?: string, ComplementTypeId?: number | null 
}
export type skuComplements = { showTogether: SkuComplement[], similarProduct: SkuComplement[], }
export enum ComplementIdEnum {
  ACESSORY = 1,
  SUGGESTION = 2,
  SIMILAR_PRODUCT = 3,
  SHOW_TOGETHER = 5,
}
export type SKUCollectionItem = {
  id?: string;
  ref?: string;
  imageUrl?: string;
  isActive: boolean;
  skuName?: string;
};
export type CollectionProduct = {
  id: string;
  name: string;
  ref: string;
  skus: SKUCollectionItem[];
};
type SkuImage = {
  url: string;

};

type Field = {
  name: string;

};

type Specification = {
  id: string;
  value: string;
  field: Field;

};

type Specifications = {
  sku: Specification[];

};

export type SKU = {
  id: string;
  productId: string;
  name: string;
  refId: string;
  modalType: string;
  isActive: boolean;
  isKit: boolean;
  images: SkuImage[];
  unitMultiplier: number;
  creationDate: string;
  measurementUnit: string;
  height: number;
  length: number;
  width: number;
  weightKg: number;
  packagedHeight: number;
  cubicWeight: number;
  kitItensSellApart: boolean
  commercialConditionId: string;
  ean: string;
  specifications: Specifications;
  complements: skuComplements;
};
