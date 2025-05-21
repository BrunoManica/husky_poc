import { SKU } from "../../../types/Sku";

function mapSkuFields(sku: SKU) {
        const mappedSkuFields = {
            id: sku.id,
            productId: sku.productId,
            name: sku.name,
            refId: sku.refId,
            isActive: sku.isActive,
            height: sku.height,
            length: sku.length,
            width: sku.width,
            weightKg: sku.weightKg,
            packagedHeight: sku.packagedHeight,
            cubicWeight: sku.cubicWeight,
            kitItensSellApart: sku.kitItensSellApart,
            commercialConditionId: sku.commercialConditionId,
            isKit: sku.isKit,
            unitMultiplier: Number(sku.unitMultiplier),
            creationDate: sku.creationDate,
            modalType: sku.modalType || null,
            measurementUnit: sku.measurementUnit,
        };

    return mappedSkuFields;
}

export default mapSkuFields;
