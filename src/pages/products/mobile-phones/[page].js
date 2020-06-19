import React, { useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import ReactPaginate from 'react-paginate'
import { DivProducts } from '../../../styles'
import Context from '../../../context'
import { mobile_phones } from '../../../data'

import Layout from '../../../components/Layout'
import ProductListItem from '../../../components/ProductListItem'

const fetcher = url => {
  return fetch(url).then(res => res.json())
}

export async function getServerSideProps({ params }) {
  const data = await fetcher(
    `${
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DEV_HOST
        : process.env.NEXT_PUBLIC_PROD_HOST
    }/api/data?category=mobile_phones&page=${params.page}&limit=8`
  )

  return { props: { data, params } }
}

export default function MobilePhones(props) {
  const router = useRouter()
  const { page } = router.query

  const { itemsPerPage } = useContext(Context)

  const initialData = props.data
  const { data } = useSWR(
    `${
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DEV_HOST
        : process.env.NEXT_PUBLIC_PROD_HOST
    }/api/data?category=mobile_phones&page=${props.params.page}&limit=8`,
    fetcher,
    { initialData }
  )

  const paginate = e => {
    router.push({ pathname: `/products/mobile-phones/${e.selected + 1}`})
  }

  return (
    <React.Fragment>
      <Head>
        <title>Mobile Phones - Alimazon</title>
        <meta name="description" content={`The BEST mobile phones in the world!!!`} />
      </Head>

      <Layout>
        <DivProducts>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <Link href="/"><a className="breadcrumb-item"><li>Home</li></a></Link>
              <li className="breadcrumb-item active" aria-current="page">Mobile Phones</li>
            </ol>
          </nav>
          <div>
            {
              data.map(dataItem => {
                return <ProductListItem key={dataItem.id} dataItem={dataItem} />
              })
            }
          </div>
          <ReactPaginate 
            forcePage={page - 1}
            pageCount={Math.ceil(mobile_phones.length / itemsPerPage)}
            pageRangeDisplayed={2}
            marginPagesDisplayed={3}
            onPageChange={paginate}
            previousLabel={'«'}
            nextLabel={'»'}
            breakLabel={'...'}
            activeClassName={'active'}
            disableInitialCallback={true}
          />
        </DivProducts>
      </Layout>
    </React.Fragment>
  )
}
