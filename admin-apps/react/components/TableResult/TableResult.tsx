import React from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Table, Input, DatePicker } from 'vtex.styleguide'

import useBuildFilters from '../../hooks/useBuildFilters'

// import {
//   getOrderStatusDisplayName,
  // formatDate
// } from '../../utils'

import DataReport from '../DataReport'
import { formatParams } from './utils'

interface PropsTable {
  items: [],
  schema: object,
  bulkActions: [],
  containerHeight: number,
  density: 'low' | 'medium' | 'high',
  disableHeader: boolean,
  dynamicRowHeight: boolean,
  emptyStateChildren: Node,
  emptyStateLabel: string,
  filters: [],
  fixFirstColumn: boolean,
  fullWidth: boolean,
  lineActions: [],
  loading: boolean,
  onRowClick: Function,
  onRowHover: Function,
  onSort: Function,
  pagination: [],
  sort: [],
  toolbar: [],
  totalizers: [],
  updateTableKey: string,
  cellData: any,
  onChange: Function,
  value: any
}

interface Props {
  onChangeStatements: Function,
  alwaysVisibleFilters: string[],
  clearAllFiltersButtonLabel: string,
  device: 'phone' | 'desktop' | 'tablet',
  disabled: boolean,
  isMobile: CustomElementConstructor,
  moreOptionsLabel: string,
  newFilterLabel: string,
  noOptionsMessage: Function,
  options: object,
  statements: [],
  subjectPlaceholder: string,
  submitFilterLabel: string,
  testIds: {},
  onChange: Function,
  value: any
}

interface IResources {
  from: number,
  to: number
}

const jsonschema = {
  properties: {
    nome: {
      title: 'Nome',
    },
    sobrenome: {
      title: 'Sobrenome',
    },
    cpf: {
      title: 'CPF',
    },
    cel: {
      title: 'Celular',
    },
    email: {
      title: 'Email',
    },
    pageName: {
      title: 'Nome da página',
    },
    createdIn: {
      title: 'Data de inscrição',
    },
  },
}

const normalizeItems = (items: any) => {
  if (items.length < 1) {
    return items
  }

  return items.map((item: any) => {
    return {
      ...item,
      // status: getOrderStatusDisplayName(item.status),
      createdIn: new Date(item.createdIn).toLocaleDateString('pt-BR'),
      // max_shipping_date: item.max_shipping_date ? formatDate(item.max_shipping_date) : ''
    }
  })
}

// const buildFilters = (filterStatements: Array<any>): Array<string> => {
//   const filters: Array<string> = []

//   filterStatements.map((filter: any) => {
//     let statementValue: any
//     console.log(filter)

//     if (filter.subject === 'order_date' || filter.subject === 'max_shipping_date') {
//       const date = filter.object

//       if (filter.verb === 'between') {
//         statementValue.from = formatDateToFilter(date.from)
//         statementValue.to = formatDateToFilter(date.to)
//       } else {
//         statementValue = formatDateToFilter(date)
//       }
//     } else {
//       statementValue = filter.object
//     }

//     switch (filter.verb) {
//       case '!=':
//         filters.push(`${filter.subject}<>${statementValue}`)
//         break;
//       case 'contains':
//         filters.push(`${filter.subject}=*${statementValue}*`)
//         break;
//       case 'between':
//         filters.push(`${filter.subject} between ${statementValue.from} AND ${statementValue.to}`)
//         break;
//       default:
//         filters.push(`${filter.subject}="${statementValue}"`)
//         break;
//     }
//   })

//   return filters
// }

const tableLength = 20

const fetchOrders = async (itemsSize: number = tableLength, params?: Array<string>, page: number = 1) => {
  let data: any
  let contentRange: number = 0

  const formmatedParams = formatParams(params?? [])


  const query: string = params?.length ? `_where=(${formmatedParams?.join(' AND ')})&` : ''
  const resources: IResources = {
    from: (page * itemsSize) - itemsSize,
    to: (page * itemsSize) - 1
  }

  const config = {
    headers: new Headers({
      'REST-Range': `resources=${resources.from}-${resources.to}`
    })
  }

  await fetch(`/api/dataentities/NF/search?${query}_fields=_all`, config)
    .then(async res => {
      contentRange = Number(res.headers.get('REST-Content-Range')?.split('/').pop())
      data = await res.json()
    })

  return {
    contentRange,
    data
  }
}

const initialState = {
  order: [],
  tableLength: tableLength,
  currentPage: 1,
  currentItemFrom: 1,
  currentItemTo: tableLength,
  searchValue: '',
  itemsLength: 0,
  emptyStateLabel: 'Vazia.',
  filterStatements: [],
  loading: false
}

const SimpleInputObject = ({ value, onChange }: Props) => {
  return <Input value={value || ''} onChange={(e: { target: { value: any } }) => onChange(e.target.value)} />
}

const CpfInputObject = ({ value, onChange }: Props, shouldValidate = false) => {
  function validateCPF(cpf: string) {
    if (!cpf) {
      return false
    }

    let sum = 0
    let remainder

    if (
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'
    ) {
      return false
    }

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }
    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }
    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.substring(10, 11))) return false
    return true
  }

  const errorMessage =
    shouldValidate && value ? (validateCPF(value) ? null : 'CPF Invalído') : null
  return (
    <Input
      placeholder="Preencha o cpf…"
      type="number"
      errorMessage={errorMessage}
      min={0}
      maxLength={11}
      value={value || ''}
      onChange={(e: { target: { value: string } }) => {
        onChange(e.target.value.replace(/\D/g, ''))
      }}
    />
  )
}

const DatePickerObject = ({ value, onChange }: Props) => {
  return (
    <div className="w-100">
      <DatePicker
        value={value || new Date()}
        onChange={(date: object) => {
          onChange(date)
        }}
        locale="pt-BR"
      />
    </div>
  )
}

const DatePickerRangeObject = ({ value, onChange }: Props) => {
  return (
    <div className="flex flex-column w-100">
      <br />
      <DatePicker
        label="De"
        value={(value && value.from) || new Date()}
        onChange={(date: object) => {
          onChange({ ...(value || {}), from: date })
        }}
        locale="pt-BR"
      />
      <br />
      <DatePicker
        label="Até"
        value={(value && value.to) || new Date()}
        onChange={(date: any) => {
          onChange({ ...(value || {}), to: date })
        }}
        locale="pt-BR"
      />
    </div>
  )
}

function withBuildFilters(filterStatements: any) {
  const [buildFilters] = useBuildFilters()

  return buildFilters(filterStatements)
}

class ResourceListExample extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = initialState

    this.handleNextClick = this.handleNextClick.bind(this)
    this.handlePrevClick = this.handlePrevClick.bind(this)
    this.goToPage = this.goToPage.bind(this)
    this.handleRowsChange = this.handleRowsChange.bind(this)
    this.simpleInputObject = this.simpleInputObject.bind(this)
    this.simpleInputVerbsAndLabel = this.simpleInputVerbsAndLabel.bind(this)
    this.renderSimpleFilterLabel = this.renderSimpleFilterLabel.bind(this)
    this.handleFiltersChange = this.handleFiltersChange.bind(this)
  }

  async componentDidMount() {
    this.setState({
      loading: true
    })

    const { contentRange, data } = await fetchOrders(this.state.tableLength)

    this.setState({
      order: data,
      itemsLength: contentRange,
      loading: false
    })
  }

  async componentDidUpdate(_prevProps: any, prevState: any) {
    if (this.state.tableLength === prevState.tableLength) {
      return
    }

    this.setState({
      loading: true
    })

    const newPage = 1
    const itemFrom = 1
    const itemTo = this.state.tableLength

    const filters = withBuildFilters(this.state.filterStatements)
    const { data } = await fetchOrders(this.state.tableLength, filters)

    this.setState({
      loading: false
    })

    this.goToPage(newPage, itemFrom, itemTo, data)
  }

  async handleNextClick() {
    this.setState({
      loading: true
    })

    const newPage = this.state.currentPage + 1
    const itemFrom = this.state.currentItemTo + 1
    const itemTo = this.state.tableLength * newPage

    const filters = withBuildFilters(this.state.filterStatements)
    const { data } = await fetchOrders(this.state.tableLength, filters, newPage)

    this.setState({
      loading: false
    })

    this.goToPage(newPage, itemFrom, itemTo, data)
  }

  async handlePrevClick() {
    if (this.state.currentPage === 0) return

    this.setState({
      loading: true
    })

    const newPage = this.state.currentPage - 1
    const itemFrom = this.state.currentItemFrom - this.state.tableLength
    const itemTo = this.state.currentItemFrom - 1

    const filters = withBuildFilters(this.state.filterStatements)
    const { data } = await fetchOrders(this.state.tableLength, filters, newPage)

    this.setState({
      loading: false
    })

    this.goToPage(newPage, itemFrom, itemTo, data)
  }

  goToPage(currentPage: number, currentItemFrom: any, currentItemTo: any, data: any) {
    this.setState({
      currentPage,
      currentItemFrom,
      currentItemTo,
      order: data,
    })
  }

  handleRowsChange(_e: any, value: any) {
    this.setState(
      {
        tableLength: parseInt(value),
        currentItemTo: parseInt(value),
      },
      () => {
        const { filterStatements } = this.state
        this.handleFiltersChange(filterStatements)
      }
    )
  }

  simpleInputObject({ value, onChange }: PropsTable) {
    return (
      <Input value={value || ''} onChange={(e: { target: { value: any } }) => onChange(e.target.value)} />
    )
  }

  getSimpleVerbs() {
    return [
      {
        label: 'Igual a',
        value: '=',
        object: (props: JSX.IntrinsicAttributes & Props) => <SimpleInputObject {...props} />,
      },
      {
        label: 'Diferente de',
        value: '!=',
        object: (props: JSX.IntrinsicAttributes & Props) => <SimpleInputObject {...props} />,
      },
      {
        label: 'Contém',
        value: 'contains',
        object: (props: JSX.IntrinsicAttributes & Props) => <SimpleInputObject {...props} />,
      },
    ]
  }

  renderSimpleFilterLabel(statement: { object: any; verb: string }) {
    if (!statement || !statement.object) {
      // you should treat empty object cases only for alwaysVisibleFilters
      return 'Todos'
    }
    return `${statement.verb === '='
      ? 'Igual a'
      : statement.verb === '!='
        ? 'Diferente de'
        : 'Contém'
      } ${statement.object}`
  }

  simpleInputVerbsAndLabel() {
    return {
      renderFilterLabel: (st: { object: any; verb: string }) => {
        if (!st || !st.object) {
          // you should treat empty object cases only for alwaysVisibleFilters
          return 'Todos'
        }
        return `${st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains'
          } ${st.object}`
      },
      verbs: [
        {
          label: 'Igual a',
          value: '=',
          object: this.simpleInputObject,
        },
        {
          label: 'Diferente de',
          value: '!=',
          object: this.simpleInputObject,
        },
        {
          label: 'Contém',
          value: 'contains',
          object: this.simpleInputObject,
        },
      ],
    }
  }


  async handleFiltersChange(initialState: any) {
    this.setState({
      loading: true
    })

    const filters = withBuildFilters(initialState)
    const { contentRange, data } = await fetchOrders(this.state.tableLength, filters)

    this.setState({
      order: data,
      filterStatements: initialState,
      itemsLength: contentRange,
      loading: false,
    })
  }

  render() {
    // const {
    //   runtime: { navigate },
    // } = this.props

    return (
      <>
        <Table
          fullWidth={true}
          loading={this.state.loading}
          schema={jsonschema}
          items={normalizeItems(this.state.order)}
          // onRowClick={({ rowData }: { rowData: any }) => {
          //   navigate({
          //     page: 'admin.app.oms-detail',
          //     params: { id: rowData.id },
          //   })
          // }}
          pagination={{
            onNextClick: this.handleNextClick,
            onPrevClick: this.handlePrevClick,
            currentItemFrom: this.state.currentItemFrom,
            currentItemTo: this.state.currentItemTo,
            onRowsChange: this.handleRowsChange,
            textShowRows: 'Items',
            textOf: 'De',
            totalItems: this.state.itemsLength,
            rowsOptions: [20, 40, 60, 100],
            selectedOption: this.state.tableLength
          }}
          filters={{
            alwaysVisibleFilters: ['nome','sobrenome', 'cpf', 'celular', 'email', 'pageName' , 'createdIn'],
            statements: this.state.filterStatements,
            onChangeStatements: this.handleFiltersChange,
            clearAllFiltersButtonLabel: 'Limpar Filtros',
            collapseLeft: true,
            submitFilterLabel: 'Aplicar',
            options: {
              nome: {
                label: 'Nome',
                ...this.simpleInputVerbsAndLabel(),
              },
              sobrenome: {
                label: 'Sobrenome',
                ...this.simpleInputVerbsAndLabel(),
              },
              cpf: {
                label: 'CPF',
                renderFilterLabel: this.renderSimpleFilterLabel,
                verbs: [
                  {
                    label: 'Igual a',
                    value: '=',
                    object: (props: JSX.IntrinsicAttributes & Props) => <CpfInputObject {...props} />,
                  },
                  {
                    label: 'Contém',
                    value: 'contains',
                    object: (props: JSX.IntrinsicAttributes & Props) => <CpfInputObject {...props} />,
                  },
                ]
              },
              cel: {
                label: 'Celular',
                ...this.simpleInputVerbsAndLabel(),
              },
              email: {
                label: 'E-mail',
                ...this.simpleInputVerbsAndLabel(),
              },
              pageName: {
                label: 'Nome da página',
                ...this.simpleInputVerbsAndLabel(),
              },
              createdIn: {
                label: 'Data de inscrição',
                renderFilterLabel: (  st: { object: { from: any; to: any }; verb: string }) => {
                  if (!st || !st.object) return 'Todos'
                  return `${st.verb === 'between'
                    ? `entre ${st.object.from} e ${st.object.to}`
                    : `é ${st.object}`
                    }`
                },
                verbs: [
                  {
                    label: 'Igual a',
                    value: '=',
                    object: (props: JSX.IntrinsicAttributes & Props) => <DatePickerObject {...props} />,
                  },
                  {
                    label: 'Entre',
                    value: 'between',
                    object: (props: JSX.IntrinsicAttributes & Props) => <DatePickerRangeObject {...props} />,
                  },
                ],
              },
            },
          }}
        />

        <DataReport filterStatements={this.state.filterStatements} />
        {/* <DataReport filterStatements={this.state.filterStatements} /> */}
      </>
    )
  }
}
export default withRuntimeContext(ResourceListExample)
