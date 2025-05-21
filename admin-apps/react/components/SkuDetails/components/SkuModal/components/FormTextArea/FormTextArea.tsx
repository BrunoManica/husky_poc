import React from "react";
import { FieldToChange, SKU } from "../../../../../../types/Sku";
import { PageBlock, Input } from 'vtex.styleguide';

interface FormTextAreaProps {
    keyField: FieldToChange;
    valueForm: SKU;
    handleChange: HandleChangeType;
}

type HandleChangeType = (field: keyof SKU, value: any) => void;

const FormTextArea: React.FC<FormTextAreaProps> = ({ keyField, valueForm, handleChange }) => {
    return (
        <PageBlock>
            <label className="">{keyField.name}
                <Input
                    onChange={(e: { target: { value: any } }) => handleChange(keyField.vtexField as keyof SKU, e.target.value)}
                    name={keyField.name}
                    value={valueForm ? valueForm[keyField.vtexField as keyof SKU] || '' : ''}
                    placeholder={keyField.name}
                    size="regular"
                />
            </label>
        </PageBlock>
    );
}

export default FormTextArea;
