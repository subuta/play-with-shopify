import React from 'react'
import Link from 'next/link'
import _ from 'lodash'

import { gql } from 'graphql-request'

import { queryGqlStorefrontApi } from '@/utils/shopify'
import { PRODUCT_FRAGMENT } from '@/utils/graphql/fragments'

import Layout from '@/components/Layout'
import ProductImage from '@/components/ProductImage'
import ProductPrice from '@/components/ProductPrice'

import styles from './index.module.css'

const render = (props) => {
  const { shop, collection } = props

  // Fetch product in the `Collection`
  const products = _.map(collection.products.edges, 'node')

  return (
    <Layout shop={shop} collection={collection}>
      <h3 className="text-2xl font-bold border-b-4">Products</h3>

      <div className={styles.products}>
        {_.map(products, (product) => {
          return (
            <div className={styles.product} key={product.handle}>
              <Link href={`/products/${product.handle}`}>
                <a className="text-gray-700 font-bold">
                  <ProductImage product={product} />

                  <h4 className="mt-3 text-base md:text-xl">{product.title}</h4>

                  <ProductPrice product={product} />
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const SHOPIFY_API_TARGET_COLLECTION_HANDLE = process.env.SHOPIFY_API_TARGET_COLLECTION_HANDLE

  const query = gql`
    query($collectionHandle: String!) {
      shop {
        name
      }

      collection: collectionByHandle(handle: $collectionHandle) {
        handle
        id
        title
        image {
          transformedSrc
        }

        products(first: 100, sortKey: TITLE) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }

          edges {
            node {
              ...productDetails
            }
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const data = await queryGqlStorefrontApi(query, {
    collectionHandle: SHOPIFY_API_TARGET_COLLECTION_HANDLE,
  })

  return {
    props: data,
  }
}

export default render
