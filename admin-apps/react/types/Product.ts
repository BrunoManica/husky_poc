export type ProductVtex = {
  id: string;
  name: string;
  departmentId: string;
  supplierId: string | null;
  releaseDate: string;
  brandId: string;
  refId: string;
  isVisible: boolean;
  showWithoutStock: boolean;
  shortDescription: string | null;
  description: string;
  keywords: string;
  taxCode: string;
  score: number | null;
  title: string;
  metaTagDescription: string;
  linkId: string;
  isActive: boolean;
  categoryId: string;
  department: {
    isActive: boolean;
    name: string;
    id: string;
  };
  category: {
    id: string;
    name: string;
    parentCategoryId: string | null;
  };
  salesChannel: {
    id: string;
    name: string;
  }[];
};

type Category = {
  id: string;
  name: string;
  parentCategoryId?: string;
};

type SalesChannel = {
  id: string;
  name: string;
};

export type ProductFields = {
  id: string;
  name: string;
  departmentId: string;
  supplierId?: string | null;
  releaseDate: string;
  brandId: string;
  refId: string;
  isVisible: boolean;
  showWithoutStock: boolean;
  shortDescription?: string | null;
  description: string;
  keywords: string[];
  taxCode?: string | null;
  score?: number | null;
  title: string;
  metaTagDescription: string;
  linkId: string;
  isActive: boolean;
  categoryId: string;
  department: Category;
  category: Category;
  salesChannel: SalesChannel[];
};
export type ProductUpdated = {
  Id: any; 
  Name?: string; 
  RefId?: string; 
  DepartmentId?: string; 
  SupplierId?: string | null; 
  ReleaseDate?: string; 
  BrandId?: string; 
  IsVisible?: boolean; 
  ShowWithoutStock?: boolean; 
  ShortDescription?: string | null; 
  Description?: string; 
  Keywords?: string; 
  TaxCode?: string; 
  Score?: number | null; 
  Title?: string; 
  MetaTagDescription?: string; 
  LinkId?: string; 
  IsActive?: boolean;
   CategoryId?: string; 
   SalesChannel?: { id: string; name: string; }[];
}