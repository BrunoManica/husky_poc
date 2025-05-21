import React from "react";
import { FieldToChange, SKU } from "../../../../../../types/Sku";
import { PageBlock, } from 'vtex.styleguide';

const measureUnits = [
  { "value": "un" },
  { "value": "kg" },
  { "value": "g" },
  { "value": "mg" },
  { "value": "m" },
  { "value": "m²" },
  { "value": "cm" },
  { "value": "cm²" },
  { "value": "cm³" },
  { "value": "mm" },
  { "value": "mm²" },
  { "value": "mm³" },
  { "value": "oz" },
  { "value": "lb" },
  { "value": "ft²" },
  { "value": "ft³" },
  { "value": "in" },
  { "value": "in²" },
  { "value": "in³" }
]

interface FormMeasureUnitProps {
  keyField: FieldToChange;
  valueForm: SKU;
  handleChange: HandleChangeType;
}

type HandleChangeType = (field: keyof SKU, value: any) => void;


const FormMeasureUnit: React.FC<FormMeasureUnitProps> = ({keyField, valueForm, handleChange}) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(keyField.vtexField as keyof SKU, event.target.value);
  };
  const currentValue = valueForm ? (valueForm[keyField.vtexField as keyof SKU] as string) : "";

  return (
    <PageBlock>
      <div>
        <p style={{ margin: "0" }} className="">{keyField.name}</p>
        <select
          style={{ width: '100%', borderRadius: '4px', padding: '8px', border: "2px solid #e3e4e6" }}
          onChange={handleSelectChange}
          value={currentValue}
        >
          {measureUnits.map((measureUnit, index) => (
            <option key={index} value={measureUnit.value}>
              {measureUnit.value}
            </option>
          ))}
        </select>
      </div>
    </PageBlock>
  );
};

export default FormMeasureUnit;