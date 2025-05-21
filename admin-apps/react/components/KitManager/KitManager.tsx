import React, { FC, useState } from 'react'
import {
  PageBlock,
  InputSearch,
  Layout
} from "vtex.styleguide"

const KitManager: FC = () => {
  const [searchRefId, setSearchRefId] = useState<string | null>(null)
  console.log(searchRefId)
  return <Layout fullWidth>
    <PageBlock>
    <InputSearch
          minLength="1"
          onChange={(e: { target: { value: any; }; }) => setSearchRefId(e.target.value)}
          onSubmit={async (e: { preventDefault: () => void; target: { value: any; }; }) => {
            e.preventDefault()
            console.log(e.target.value)
          }}
          placeholder="Insira o id de produto Kit"
          size="large"
          label="Material ID" />
    </PageBlock>
  </Layout>
}

export default KitManager;