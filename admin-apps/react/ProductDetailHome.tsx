import React, { FC, useEffect, useState } from 'react'
import {
  Layout,
  PageHeader,
  Spinner,
  Tab,
  Tabs,
  PageBlock,
  Button
} from 'vtex.styleguide'
import ProductDetailWrapper from './components/ProductDetail/ProductDetailWrapper'
import useAuth from './components/api/GetUserRoles/GetUserRoles'
enum handleStates {
  "ISINITIAL" = 0,
  "ISLOADING" = 1,
  "ISERROR" = 2,
  "ISSUCCESS" = 3
}
// jogar enum em utils para reutilizar
const ProductDetailHome: FC = () => {
  const { loading: loadingLogin, isLogged } = useAuth()
  const [appState, setAppState] = useState(handleStates.ISINITIAL)
  const [initialState, setInitialState] = useState({ currentTab: 1 })
  const [typeOfUseSate, setTypeOfUseSate] = useState({ crateProduct: 0 })
  console.log(loadingLogin, isLogged)
  const getUserAuthorization = async () => {
    setAppState(handleStates.ISLOADING)
    try {
      setAppState(handleStates.ISSUCCESS)
    } catch (error) {
      setAppState(handleStates.ISERROR)
      console.error(error)
    }
  }

  const changeProductAction = (createProduct: number) => {
    createProduct === 1 ? setTypeOfUseSate({ crateProduct: 2 }) : setTypeOfUseSate({ crateProduct: 1 })
  }

  useEffect(() => {
    getUserAuthorization()
  }, [])

  return (

    <Layout>
      <PageHeader
        title="Product Manager FSJ"
        subtitle="powered by FSJDigital"
      />
      <PageBlock>
        {loadingLogin && (
          <PageBlock>
            carregando permissões...
          </PageBlock>
        )}
        {
          isLogged &&
          (<>
            <h2>Escolha uma opção abaixo</h2>
            <PageBlock>
              <div>
                <Button onClick={() => changeProductAction(2)}>
                  Produto
                </Button>
              </div>
            </PageBlock>
          </>)
        }
        {!loadingLogin && !isLogged && (

          <PageBlock>
            <PageHeader
              title="🔴 Bip...Bop...Você não tem permissão 🤖"
              linkLabel="Home"
              onLinkClick={(e: any) => {
                console.log(e)
              }}
            />
            Verifique suas permissões com o Gestor da área 🔐</PageBlock>)}
      </PageBlock>

      {appState === handleStates.ISLOADING &&
        <PageBlock>
          <Spinner />
        </PageBlock>}
      {appState === handleStates.ISSUCCESS && typeOfUseSate.crateProduct === 1 && (
        <div>
          <Tabs>
            <Tab
              label="Alteração de Produtos"
              active={initialState.currentTab === 1}
              onClick={() => setInitialState({ currentTab: 1 })}>
              <div>
                <ProductDetailWrapper />
              </div>
            </Tab>
            <Tab
              label="Cadastro de Produtos"
              active={initialState.currentTab === 2}
              onClick={() => setInitialState({ currentTab: 2 })}
            >
              <div>cadastro de produto</div>
            </Tab>
          </Tabs>
        </div>
      )}
    </Layout>
  )
}

export default ProductDetailHome
