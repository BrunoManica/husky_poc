import React, { useEffect, useState } from 'react';
import { withRuntimeContext } from 'vtex.render-runtime';
import { DatePicker, Dropdown, Input, PageBlock, Textarea, Toggle, Checkbox } from 'vtex.styleguide';
import { useMutation, useQuery } from 'react-apollo';
import UPDATE_SALES_CHANNEL from '../../../../graphql/mutations/updateSalesChannel.gql';
import REMOVE_SALES_CHANNEL from '../../../../graphql/mutations/removeProductFromSalesChannel.gql';
import GET_SALES_CHANNEL_LIST from '../../../../graphql/getSalesChannelList.gql';
import SpinnerComponent from '../SpinnerComponent/SpinnerComponent';
import { ProductFields } from '../../../../types/Product';
// import { SkuVtex } from '../../../../types/Sku';

type Props = {
  valuesVtex: ProductFields;
  fieldsToChange: FieldToChange[];
  onChange: (updatedValues: ValueForm) => void; 
};

type FieldToChange = {
  name: string;
  type: string;
  vtexField: string;
};

type SalesChannel = {
  id: string;
  name: string;
};

type SalesChannelData = {
  salesChannelList: SalesChannel[];
};

type ValueForm = ProductFields & Record<string, any>;

const DinamicForm = ({ valuesVtex, fieldsToChange, onChange }: Props) => {
  const [valueForm, setValueForm] = useState<ValueForm>(valuesVtex);
  const [dataSalesChannel, setDataSalesChannel] = useState<SalesChannel[]>([]);
  const [checkedState, setCheckedState] = useState<boolean[]>([]);
  const { loading: loadingChannels } = useQuery(GET_SALES_CHANNEL_LIST, {
    onCompleted: (fetchedData: SalesChannelData) => {
      console.log(fetchedData, )
      setDataSalesChannel(fetchedData.salesChannelList);
    },
  });

  const [updateProduct, { loading: loadingUpdate }] = useMutation(UPDATE_SALES_CHANNEL);
  const [removeProduct, { loading: loadingRemove }] = useMutation(REMOVE_SALES_CHANNEL);

  useEffect(() => {
    if (dataSalesChannel.length > 0) {
      console.log(valueForm.salesChannel, "::>>>>>")
      const initialCheckedState = dataSalesChannel.map((channel) =>
      
        valueForm.salesChannel.some((salesChannel) => salesChannel.id === channel.id)
      );
      setCheckedState(initialCheckedState);
    }
  }, [dataSalesChannel, valueForm.salesChannel]);


 const handleChange = (vtexField: string, value: any) => {
    const updatedForm = {
      ...valueForm,
      [vtexField]: value,
    };
    setValueForm(updatedForm);
    onChange(updatedForm)
  }
  const renderSalesChannel = () => {
   
    const handleCheckboxChange = (index: number, id: string, checked: boolean) => {
      console.log(valueForm.salesChannel, "valueForm")
      const updatedCheckedState = checkedState.map((state, idx) => (idx === index ? !state : state));
      setCheckedState(updatedCheckedState);

      if (!checked) {
        updateProduct({
          variables: {
            id,
            productId: valueForm.id!,
          },
        });
        setValueForm((prevState) => ({
          ...prevState,
          salesChannel: [...prevState.salesChannel, { id, name: dataSalesChannel[index].name }],
        }));
      } else {
        removeProduct({
          variables: {
            id,
            productId: valueForm.id!,
          },
        });
        setValueForm((prevState) => ({
          ...prevState,
          salesChannel: prevState.salesChannel.filter((channel) => channel.id !== id),
        }));
      }
    };

    return (
      <>
        {loadingChannels ? (
          <SpinnerComponent />
        ) : (
          dataSalesChannel.map((channel, index) => (
            <Checkbox
              key={channel.id}
              label={channel.name}
              checked={checkedState[index] || false}
              onChange={() => handleCheckboxChange(index, channel.id, checkedState[index])}
            />
          ))
        )}
      </>
    );
  };

  const renderField = (field: FieldToChange) => {
    switch (field.type) {
      case 'Toggle':
        return (
          <PageBlock>
            <Toggle
              label={valueForm[field.vtexField] ? 'Sim' : 'Não'}
              checked={valueForm[field.vtexField]}
              name={field.name}
              semantic
              onChange={(e: { target: { checked: any; }; }) => handleChange(field.vtexField, e.target.checked)}
            />
          </PageBlock>
        );

      case 'TextField':
        return (
          <PageBlock>
            <Input
              value={valueForm[field.vtexField]}
              name={field.name}
              placeholder={field.name}
              onChange={(e: { target: { value: any; }; }) => handleChange(field.vtexField, e.target.value)}
            />
          </PageBlock>

        );

      case 'TextArea':
        return (
          <PageBlock>
            <Textarea
              value={valueForm[field.vtexField]}
              name={field.name}
              placeholder={field.name}
              onChange={(e: { target: { value: any; }; }) => handleChange(field.vtexField, e.target.value)}
            />
          </PageBlock>

        );

      case 'DatePicker':
        return (
          <PageBlock>
            <DatePicker
              value={new Date(valueForm[field.vtexField])}
              onChange={(date: Date) => handleChange(field.vtexField, date.toISOString())}
              locale="pt-BR"
            />
          </PageBlock>

        );

      case 'Dropdown':
        return (
          <PageBlock>
            <Dropdown
              value={valueForm[field.vtexField] || ''}
              options={[
                { value: '', label: 'Selecione uma opção' },
                { value: 'Padrão', label: 'Padrão' },
              ]}
              label={field.name}
              onChange={(_e: any, value: string) => handleChange(field.vtexField, value)}
            />
          </PageBlock>

        );

      case 'CheckboxGroup':
        return renderSalesChannel();

      default:
        return null;
    }
  };


  return (
    <PageBlock>
      {fieldsToChange.map((field, index) => (
        <div className="mt4 mb4" key={index}>
          {field.name}
          {renderField(field)}
        </div>
      ))}
      {(loadingUpdate || loadingRemove) && <SpinnerComponent />}
    </PageBlock>
  );
};

export default withRuntimeContext(DinamicForm);
