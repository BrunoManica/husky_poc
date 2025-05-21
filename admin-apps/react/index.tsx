import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'

import ResourceListExample from './components/TableResult'
import './styles.global.css'

const OrderOMS: FC = () => {
  return (
    <Layout
      fullWidth={true}
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-example.hello-world" />}
        />
      }
    >
      <PageBlock variation="full">
        <ResourceListExample />
      </PageBlock>
    </Layout>
  )
}

export default OrderOMS
