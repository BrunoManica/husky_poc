import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, PageBlock, Input, Spinner, Tag, Alert } from 'vtex.styleguide';
import { SimpleSkuInfo, SKU, SKUCollectionItem, skuComplements } from '../../../../types/Sku';
import { withRuntimeContext } from 'vtex.render-runtime';
import { useLazyQuery, useMutation } from 'react-apollo';
import SKUS_DATA from "../../../../graphql/getSku.gql";
import mapSkuFields from '../../../api/mapSkuFields/mapSkuFields'
import SKUS_UPDATE from "../../../../graphql/mutations/updateSku.gql"
import { deleteComplement, getSimpleSku, getSkuComplements, updateComplements, updateSkuEanVtex } from '../../../api/FindProductAndskuByRefid/FindProductAndskuByRefid';
import SpinnerComponent from '../../../ProductDetail/components/SpinnerComponent/SpinnerComponent';
import { FieldToChange } from "../../../../types/Sku"
import FormTextArea from './components/FormTextArea/FormTextArea';
import FormToggle from './components/FormToggle/FormToggle';
import FormMeasureUnit from './components/FormMeasureUnit/FormMeasureUnit';
import FormModalTypes from './components/FormModalTypes/FormModalTypes';
import FormImage from './components/FormImage/FormImage';

type Props = {
  valuesVtex: SKUCollectionItem
  fieldsToChange: FieldToChange[]
}

const SkuModal = ({ valuesVtex, fieldsToChange }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateSKu, { loading: loadingUpdate, error: errorUpdate }] = useMutation(SKUS_UPDATE);

  const [alertErrorSimilar, setAlertErrorSimilar] = useState<boolean>(false);

  const [alertErrorStg, setAlertErroStg] = useState<boolean>(false);

  const [successUpdate, setSuccessUpdate] = useState<boolean>(false);

  const [errorUpdateProduct, setErrorUpdate] = useState<string>("");

  const [previousComplements, setPreviousComplements] = useState<skuComplements | null>(null);

  const [closeError, setCloseError] = useState<boolean>(false)

  const [getSku, { loading: loadingSkus, data: dataSkus }] = useLazyQuery(SKUS_DATA);

  const [valueForm, setValueForm] = useState<SKU | undefined>(undefined);

  const [complements, setComplements] = useState<skuComplements | null>(null);

  const [loaderShowTogether, setLoaderShowTogether] = useState(false);

  const [loaderSimilarProduct, setLoaderSimilarProduct] = useState(false);

  const isMounted = useRef<boolean>(true);

  const getComplements = async (complementsItens: string, key: string): Promise<SimpleSkuInfo[]| void> => {
    try {

      const complementArray: SimpleSkuInfo[] = [];

      const complementsKey = key === "showTogether" ? complements?.showTogether : complements?.similarProduct;

      const complementTypeId = key === "showTogether" ? 5 : 3;

      const skufromComplements = await getSimpleSku(complementsItens, null);
      if(!skufromComplements){
        return;
      }
      skufromComplements.ComplementTypeId = complementTypeId;

      await updateComplements(valueForm?.id!, [skufromComplements])

      complementArray.push(skufromComplements);

      if (complementsKey) {
        complementArray.push(...complementsKey);
      }

      return complementArray;

    } catch (error) {
      console.error("Erro ao buscar complementos:", error);
      key === "showTogether" ? setAlertErroStg(true) : setAlertErrorSimilar(true)
      return [];
    }
  };
  const handleInputValue = async (
    complementsInputData: string | undefined,
    key: string,
    setLoader: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!complementsInputData) return;
    setLoader(true);

    setPreviousComplements(complements);

    try {
      const skufromComplements = await getComplements(complementsInputData, key);
      if(!skufromComplements) return;
      const SkuIds = skufromComplements.map((item: any) => item.SkuId);
      const filteredSkuComplements = skufromComplements.filter(
        (item: any, index: any) => SkuIds.indexOf(item.SkuId) === index
      );

      setComplements((prevComplements) => {
        if (!prevComplements) {
          return {
            showTogether: [],
            similarProduct: [],
            [key]: filteredSkuComplements,
          };
        }

        const updatedComplements = {
          ...prevComplements,
          [key as keyof skuComplements]: filteredSkuComplements,
        };

        return updatedComplements;
      });

      handleChange(key as keyof SKU, filteredSkuComplements);
    } catch (error) {
      setComplements(previousComplements);
      key === "showTogether" ? setAlertErroStg(true) : setAlertErrorSimilar(true);
    }
    setLoader(false);
  };

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchComplements = async () => {
      try {
        const fetchedComplements = await getSkuComplements(valuesVtex.id!);
        setComplements(fetchedComplements);
        //console.log("Fetched complements:", fetchedComplements);
      } catch (error) {
        console.error("Error fetching complements:", error);
      }
    };

    if (valuesVtex.id) {
      fetchComplements();
    }
  }, [valuesVtex.id]);

  useEffect(() => {
    if (errorUpdate) {
      setCloseError(true);
      setErrorUpdate("Verifique os campos alterados ou tente novamente mais tarde");
    }
  }, [errorUpdate]);

  useEffect(() => {
    if (valuesVtex.id) {
      getSku({
        variables: {
          identifier: {
            field: "id",
            value: valuesVtex.id,
          },
        },
      });
    }
  }, [getSku, valuesVtex.id]);

  useEffect(() => {
    if (dataSkus) {
      setValueForm(dataSkus.sku);
    }
  }, [dataSkus]);



  const sendSkuUpdate = async () => {
    const skusUpdated = mapSkuFields(valueForm!);
    try {
      await updateSKu({ variables: { input: skusUpdated } });
      await updateSkuEanVtex(valueForm?.id!, valueForm?.ean!)
      setSuccessUpdate(!successUpdate);
      setCloseError(false);
      handleModalToggle();
    } catch (error) {
      setCloseError(!closeError);
      setSuccessUpdate(false);
      handleModalToggle()
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (field: keyof SKU, value: any) => {
    if (isMounted.current) {
      setValueForm(prevValueForm => {
        if (prevValueForm) {
          return {
            ...prevValueForm,
            [field]: value,
          };
        }
        return prevValueForm;
      });
    }
  };

  const handleRemoveItem = async (selectedItem: { SkuId: string; }, key: { name?: string; type?: string; vtexField: any; }) => {
    if (!complements) return;

    const updatedComplements = {
      ...complements,
      [key.vtexField as keyof skuComplements]: complements[key.vtexField as keyof skuComplements].filter((complement: { SkuId: string; }) => complement.SkuId !== selectedItem.SkuId)
    };
    await deleteComplement(valueForm?.id!, selectedItem.SkuId);

    setComplements(updatedComplements);

    handleChange(key.vtexField as keyof SKU, updatedComplements[key.vtexField as keyof skuComplements]);
  };

  const formInputButtonSimilars = (key: FieldToChange) => {
    const loader = loaderSimilarProduct
    const setLoader = setLoaderSimilarProduct
    let inputValue: string | undefined = undefined;

    const handleAddItem = (setLoader: React.Dispatch<React.SetStateAction<boolean>>) => {
      handleInputValue(inputValue, key.vtexField, setLoader);
    };
    return (
      <PageBlock>
        {alertErrorSimilar && (
          <Alert onClose={() => {
            setAlertErrorSimilar(false);
            setComplements(previousComplements);
          }} type="error">
            erro ao adicionar Similar, verifique o id do Material e tente novamente.
          </Alert>
        )}
        <Input
          placeholder="Insira um id de material por vez"
          size="regular"
          label={key.name}
          value={inputValue}
          onChange={(e: { target: { value: string; }; }) => (inputValue = e.target.value)}
        />
        {loader ? (
          <SpinnerComponent />
        ) : (
          <>
            <div>
              {complements?.similarProduct && complements?.similarProduct?.map((complement, index) => (
                <span style={{ display: "flex" }} key={index} className="ml2 mb3">
                  <Tag onClick={() => handleRemoveItem(complement, key)} bgColor="#00f" color="#fff">
                    {complement.name}
                  </Tag>
                </span>
              ))}
            </div>
            <div className="mt4">
              <Button onClick={() => handleAddItem(setLoader)}>ADICIONAR</Button>
            </div>
          </>
        )}
      </PageBlock>
    );
  }
  const formInputButtonShowTogether = (key: FieldToChange) => {
    const loader = loaderShowTogether
    const setLoader = setLoaderShowTogether
    let inputValue: string | undefined = undefined;

    const handleAddItem = (setLoader: React.Dispatch<React.SetStateAction<boolean>>) => {
      handleInputValue(inputValue, key.vtexField, setLoader);
      inputValue = "";
    };
    return (
      <PageBlock>
        {alertErrorStg && (
          <Alert onClose={() => {
            setAlertErroStg(false);
            setComplements(previousComplements);
          }} type="error">
            erro ao adicionar Compre Junto, verifique o id do Material e tente novamente.
          </Alert>
        )}
        <Input
          placeholder="Insira um id de materia por vez"
          size="regular"
          label={key.name}
          onChange={(e: { target: { value: string; }; }) => (inputValue = e.target.value)}
        />
        {loader ? (
          <SpinnerComponent />
        ) : (
          <>
            <div>
              {complements?.showTogether && complements?.showTogether?.map((complement, index) => (
                <span style={{ display: "flex" }} key={index} className="ml2 mb3">
                  <Tag onClick={() => handleRemoveItem(complement, key)} bgColor="#00f" color="#fff">
                    {complement.name}
                  </Tag>
                </span>
              ))}
            </div>
            <div className="mt4">
              <Button onClick={() => handleAddItem(setLoader)}>ADICIONAR</Button>
            </div>
          </>
        )}
      </PageBlock>
    );
  };


  return (
    <>
      <PageBlock>

        {loadingSkus && !loadingUpdate ? (
          <PageBlock>
            <Spinner />
            <p>Carregando skus...</p>
          </PageBlock>
        ) : (
          <form action="">
            <div style={{ display: 'flex', flexFlow: 'column' }}>
              <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'baseline', justifyContent: "space-between", width: "fit-content", gap: "7px" }}>
                <h4>NOME SKU: </h4>
                <p style={{ marginRight: "4px" }}> {valuesVtex.skuName ? valuesVtex.skuName : "Não possui"}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ width: "100%", marginTop: "auto" }}>
                <Button variation="primary" onClick={handleModalToggle}>Editar</Button>
              </div>
              <div style={{ width: "10%", display: "flex", marginTop: "auto" }}>
                <img style={{ border: 'solid 1px lightgray', borderRadius: "10px" }}
                  src={valuesVtex.imageUrl}
                  alt={valuesVtex.skuName}></img>
              </div>
            </div>
            {successUpdate &&
              <div style={{ marginTop: "15px" }}>
                <Alert type="success" onClose={() => setSuccessUpdate(!successUpdate)}>
                  Sucesso ao atualizar o SKU  <span style={{ fontWeight: '500', fontStyle: 'italic', margin: '0 6px' }}>{valuesVtex.skuName ? valuesVtex.skuName : "o sku"}</span>
                </Alert>
              </div>}
            {closeError &&
              <div style={{ marginTop: "15px" }}>
                <Alert type="error" onClose={() => setCloseError(!closeError)}>
                  <div style={{ display: "flex", flexFlow: "column" }}>
                    <span style={{ fontWeight: '500', fontStyle: 'italic' }}>Erro ao atualizar o SKU {valuesVtex.skuName ? valuesVtex.skuName : ""}</span>
                    error: {errorUpdateProduct}
                  </div>
                </Alert>
              </div>
            }
            <Modal
              centered
              isOpen={isModalOpen}
              onClose={handleModalToggle}
            >
              {valueForm && (
                <PageBlock>
                  {fieldsToChange.map((key, index) => {
                    let field;
                    switch (key.type) {
                      case "Toggle":
                        field = <FormToggle keyField={key} valueForm={valueForm} handleChange={handleChange} />;
                        break;
                      case "images":
                        field = <FormImage keyField={key} valueForm={valueForm} handleChange={handleChange} />;
                        break;
                      case "textArea":
                        field = <FormTextArea keyField={key} valueForm={valueForm} handleChange={handleChange} />;
                        break;
                      case "select":
                        field = <FormModalTypes keyField={key} valueForm={valueForm} handleChange={handleChange} />;
                        break;
                      case "selectUnit":
                        field = <FormMeasureUnit keyField={key} valueForm={valueForm} handleChange={handleChange} />;
                        break;
                      case "showTogether":
                        field = formInputButtonShowTogether(key);
                        break;
                      case "similarProduct":
                        field = formInputButtonSimilars(key);
                        break;
                      default:
                        field = null;
                        break;
                    }
                    return <div className="mt4 mb4" key={index}>{field}</div>;
                  })}
                  {loadingUpdate ? (<PageBlock>
                    <Spinner />
                    <p>Atualizando...</p>
                  </PageBlock>) :
                    (<Button onClick={sendSkuUpdate}>Atualizar</Button>)}
                </PageBlock>
              )}

            </Modal>
          </form>
        )}
      </PageBlock>
    </>
  );


}

export default withRuntimeContext(SkuModal);
