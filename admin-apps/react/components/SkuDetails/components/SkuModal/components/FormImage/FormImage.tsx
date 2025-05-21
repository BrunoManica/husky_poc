import React from "react";
import { FieldToChange, SKU } from "../../../../../../types/Sku";

type HandleChangeType = (field: keyof SKU, value: any) => void;
interface FormImageProps {
  keyField: FieldToChange;
  valueForm: SKU;
  handleChange: HandleChangeType;
}
const FormImage: React.FC<FormImageProps> = ({ keyField, valueForm,  }) => {
    let firstImage = valueForm?.images[0].url;
    if (firstImage) {
      firstImage = firstImage.replace("-55-55", "-300-300");
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '30%' }}>
          <img style={{ border: 'px solid #e3e4e6', borderRadius: '13px', width: '100%' }} className="image" src={firstImage} alt={keyField.name} />
        </div>
        <div style={{ width: '60%' }}>
          <h2>{valueForm?.name}</h2>
          <h4>SkuId: {valueForm?.id}</h4>
          <h4>RefId: {valueForm?.refId || "não possui"}</h4>
        </div>
      </div>
    );
  };
export default FormImage;