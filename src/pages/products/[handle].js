import React from 'react'
import { useRouter } from 'next/router'

import { gql } from 'graphql-request'

import { queryGqlStorefrontApi, getVariantId } from '@/utils/shopify'

import { PRODUCT_FRAGMENT } from '@/utils/graphql/fragments'

import Cart from '@/components/hooks/useCart'
import Notification from '@/components/hooks/useNotification'

import Layout from '@/components/Layout'
import ProductImage from '@/components/ProductImage'
import ProductPrice from '@/components/ProductPrice'
import Button from '@/components/Button'
import _ from 'lodash'

const render = (props) => {
  const { add } = Cart.useContainer()
  const { push } = Notification.useContainer()
  const router = useRouter()

  const { shop, product } = props

  const onAdd = () => {
    // Do notify cart changes.
    push(`"${product.title}" is just Added to your Cart.`, {
      label: 'VIEW CART',
      callback() {
        router.push('/cart')
      },
    })
    add({
      handle: product.handle,
      variantId: getVariantId(product),
    })
  }

  return (
    <Layout shop={shop}>
      <div className="flex flex-col items-start md:flex-row">
        <ProductImage className="px-16" product={product} />

        <div className="md:px-32 flex-1 w-full">
          <h2 className="my-4 text-3xl font-bold">{product.title}</h2>
          <ProductPrice className="text-xl font-bold" product={product} />

          <Button className="mt-8 w-full" onClick={onAdd} bordered>
            ADD TO CART
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps(ctx) {
  const { handle } = ctx.params

  const query = gql`
    query($handle: String!) {
      shop {
        name
      }

      product: productByHandle(handle: $handle) {
        ...productDetails
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const data = await queryGqlStorefrontApi(query, { handle })

  return {
    props: data,
  }
}

export async function getStaticPaths() {
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

  const products = _.map(data.collection.products.edges, 'node')

  return {
    paths: _.map(products, (product) => ({
      params: {
        handle: product.handle,
      },
    })),
    fallback: false,
  }
}

export default render
