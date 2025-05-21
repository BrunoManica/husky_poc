import xlsx from 'json-as-xlsx'
// import {
//   getOrderStatusDisplayName,
//   formatDate
// } from '../../utils'

function useSaveAsExcel() {
  // const normalizeData = (data: any) => {
  //   const newData = data.map((item: any) => {
  //     const products = JSON.parse(item.products)
  //     const list = []

  //     for (const product of products) {
  //       list.push({
  //         ...item,
  //         product_name: product.name,
  //         product_price: product.price,
  //         product_miles: product.miles,
  //         product_miles_discount: product.miles_discount
  //       })
  //     }

  //     return list
  //   })

  //   return [].concat.apply([], newData)
  // }

  // const saveAsExcel = (headers: Array<string>, data: any, title?: string, isTitleBold?: boolean, headerColor?: string) => {
  const saveAsExcel = (orders: any) => {

    let data = [
      {
        columns: [
          {
            label: 'Nome',
            value: 'nome'
          },
          {
            label: 'Sobrenome',
            value: 'sobrenome'
          },
          {
            label: 'CPF',
            value: 'cpf'
          },
          {
            label: 'Celular',
            value: 'cel'
          },
          {
            label: 'Email',
            value: 'email'
          },
          {
            label: 'Data de criação',
            value: 'createdIn'
          },
        ],
        // content: normalizeData(orders),
        content: orders,
      }
    ]

    let settings = {
      fileName: "Relatório", // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    }

    xlsx(data, settings)
  }

  return [saveAsExcel]
}

export default useSaveAsExcel
