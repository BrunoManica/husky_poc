import React, { FC } from 'react';
import { InputSearch, PageBlock } from 'vtex.styleguide';

interface InputSearchProps {
  searchRefId: string;
  setSearchRefId: (value: string) => void;
  fetchProductData: () => void;
  resetStates: () => void;
}

const InputSearchComponent: FC<InputSearchProps> = ({ searchRefId, setSearchRefId, fetchProductData, resetStates }) => {
  return (
    <PageBlock>
      <InputSearch
        minLength={1}
        value={searchRefId}
        onChange={(e: { target: { value: any } }) => {
          setSearchRefId(e.target.value);
          resetStates();
        }}
        onSubmit={(e: { preventDefault: () => void }) => {
          e.preventDefault();
          fetchProductData();
        }}
        placeholder="Insira o ID do produto"
        size="large"
        label="Material ID"
      />
    </PageBlock>
  );
};

export default InputSearchComponent;
