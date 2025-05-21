import { ProductVtex } from "../../../types/Product";
function mappedroductFields(product: ProductVtex) {
    const productFields = {
        Id: product.id,
        Name: product.name,
        RefId: product.refId,
        DepartmentId: product.departmentId,
        SupplierId: product.supplierId,
        releaseDate: product.releaseDate,
        BrandId: product.brandId,
        IsVisible: product.isVisible,
        ShowWithoutStock: product.showWithoutStock,
        ShortDescription: product.shortDescription,
        Description: product.description,
        Keywords: product.keywords.toString(),
        TaxCode: product.taxCode,
        Score: product.score,
        Title: product.title,
        MetaTagDescription: product.metaTagDescription,
        LinkId: product.linkId,
        IsActive: product.isActive,
        CategoryId: product.categoryId,
        SalesChannel: product.salesChannel,
    };

    return productFields;
}

export default mappedroductFields;
