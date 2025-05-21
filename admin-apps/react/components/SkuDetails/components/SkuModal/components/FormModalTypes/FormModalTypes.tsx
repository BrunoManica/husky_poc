import React from "react";
import { FieldToChange, SKU } from "../../../../../../types/Sku";
import { PageBlock,  } from 'vtex.styleguide';


type HandleChangeType = (field: keyof SKU, value: any) => void;
interface FormModalTypesProps {
  keyField: FieldToChange;
  valueForm: SKU;
  handleChange: HandleChangeType;
}

const FormModalTypes: React.FC<FormModalTypesProps> = ({keyField, valueForm, handleChange}) => {
    const handleSelectChange = (event: { target: { value: any; }; }) => {
      let changeAction = event.target.value
      if (event.target.value === "não possui") changeAction = null;
      handleChange(keyField.vtexField as keyof SKU, changeAction);
    };
    return (
      <div>
        <PageBlock>
          <p style={{ margin: "0" }} className="">Modal</p>
          <select
            style={{ width: '100%', borderRadius: '4px', padding: '8px', border: "2px solid #e3e4e6" }}
            value={valueForm ? valueForm[keyField.vtexField as keyof SKU] as string : ""}
            onChange={handleSelectChange}
          >
            <option value="">Não possui</option>
            <option value="CHEMICALS">CHEMICALS</option>
            <option value="ELECTRONICS">ELECTRONICS</option>
          </select>
        </PageBlock>
      </div>
    );
  };

export default FormModalTypes;