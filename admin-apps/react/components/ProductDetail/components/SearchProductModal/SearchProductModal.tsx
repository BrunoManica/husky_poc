import React from 'react';
import { withRuntimeContext } from 'vtex.render-runtime';

import {
  InputSearch,
  Modal
} from 'vtex.styleguide';


type Props = {
  openModal: boolean,
  sethandleOpenModal: Function
}


const SearchProductModal = ({ openModal, sethandleOpenModal }: Props) => {


  return (
    <>
      <Modal
        centered
        isOpen={openModal}
        onClose={() => sethandleOpenModal(!openModal)}
      >

        <InputSearch
          minLength="1"
          placeholder="Insira o id de produto"
          size="large"
          label="Material ID" />

      </Modal>
    </>
  );
}

export default withRuntimeContext(SearchProductModal);
