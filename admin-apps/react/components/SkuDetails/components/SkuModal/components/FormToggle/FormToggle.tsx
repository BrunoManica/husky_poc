import React from "react";
import { PageBlock, Toggle, Alert } from 'vtex.styleguide';
import { FieldToChange, SKU } from "../../../../../../types/Sku";

type HandleChangeType = (field: keyof SKU, value: any) => void;

interface FormToggleProps {
  keyField: FieldToChange;
  valueForm: SKU;
  handleChange: HandleChangeType;
}

const FormToggle: React.FC<FormToggleProps> = ({ keyField, valueForm, handleChange }) => {
  const [close, setClose] = React.useState(true);

  return (
    <PageBlock>
      {keyField.vtexField == "isKit" ? (
        <>
          <p style={{ margin: "0" }}>{keyField.name}</p>
          <Toggle
            label={valueForm && valueForm[keyField.vtexField as keyof SKU] ? "Sim" : "Não"}
            checked={valueForm ? (valueForm[keyField.vtexField as keyof SKU] as boolean) : false}
            name={keyField.name}
            semantic
            onChange={(e: { target: { checked: any } }) => handleChange(keyField.vtexField as keyof SKU, e.target.checked)}
          />
          <br />
          {close && (
            <div>
              <Alert type="warning" onClose={() => setClose(!close)}>
                Vá com cautela ao ativar. A ativação de kits é irreversível.
              </Alert>
            </div>
          )}
        </>
      ) : (
        <>
          <p style={{ margin: "0" }}>{keyField.name}</p>
          <Toggle
            label={valueForm && valueForm[keyField.vtexField as keyof SKU] ? "Sim" : "Não"}
            checked={valueForm && (valueForm[keyField.vtexField as keyof SKU] as boolean)}
            name={keyField.name}
            semantic
            onChange={(e: { target: { checked: any } }) => handleChange(keyField.vtexField as keyof SKU, e.target.checked)}
          />
        </>
      )}
    </PageBlock>
  );
};

export default FormToggle;
