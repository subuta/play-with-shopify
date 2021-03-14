import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Link from 'next/link'

import { Value } from 'react-powerplug'

import classNames from 'classnames'

import { queryGqlStorefrontApi, getVariantId, doCheckout } from '@/utils/shopify'
import { PRODUCT_FRAGMENT } from '@/utils/graphql/fragments'
import { formatYen } from '@/utils/currency'

import { gql } from 'graphql-request'

import Layout from '@/components/Layout'
import ProductImage from '@/components/ProductImage'
import ProductPrice, { getPriceOfProduct } from '@/components/ProductPrice'
import Button from '@/components/Button'
import Loader from '@/components/Loader'

import Cart from '@/components/hooks/useCart'

import styles from './cart.module.css'

const QtyInput = ({ cartItem, onChange }) => {
  return (
    <Value
      initial={cartItem.quantity}
      onChange={(nextValue) => {
        onChange(cartItem, Number(nextValue))
      }}
    >
      {({ value, set }) => (
        <input
          className="px-4 py-2 w-16 border rounded-sm text-center md:py-3 md:w-20"
          type="number"
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      )}
    </Value>
  )
}

const render = (props) => {
  const { cart, remove, isCartLoaded, setQuantity, empty } = Cart.useContainer()
  const [data, setData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    ;(async function () {
      // Wait until cart loaded.
      if (!isCartLoaded) return

      const variantIds = _.compact(_.map(cart, (cartItem) => cartItem.variantId))

      const query = gql`
        query($variantIds: [ID!]!) {
          shop {
            name
          }

          variants: nodes(ids: $variantIds) {
            ... on ProductVariant {
              id
              product {
                ...productDetails
              }
            }
          }
        }
        ${PRODUCT_FRAGMENT}
      `
      const data = await queryGqlStorefrontApi(query, { variantIds })
      setData(data)
    })()
    return () => {}
  }, [isCartLoaded])

  if (!data) return null

  const { shop, variants } = data

  const products = _.map(variants, 'product')

  const subTotalOfCart = (cart) => {
    return _.reduce(
      cart,
      (acc, cartItem) => {
        const product = _.find(products, { handle: cartItem.handle })
        const price = getPriceOfProduct(product)
        const quantity = cartItem.quantity
        return acc + price * quantity
      },
      0
    )
  }

  const onCheckout = async () => {
    setIsSubmitting(true)

    console.log('[start] doCheckout')
    const webUrl = await doCheckout(cart)
    console.log('[end] doCheckout, will redirect to webUrl.')

    // Clear current cart.
    empty()

    // Redirect to Shopify's checkout webUrl.
    location.href = webUrl

    // Clear isSubmitting.
    setIsSubmitting(false)
  }

  if (cart && cart.length <= 0) {
    return (
      <Layout shop={shop}>
        <h3 className="text-2xl font-bold border-b-4">Your cart</h3>

        <p className="my-6">Your cart is currently empty.</p>

        <Button className="inline-flex items-center" href="/" filled>
          <span>Continue Shopping</span>
          <i className="ml-4 material-icons">arrow_right_alt</i>
        </Button>
      </Layout>
    )
  }

  return (
    <Layout shop={shop}>
      <h3 className="text-2xl font-bold border-b-4">Your cart</h3>

      <Link href="/">
        <a className="inline-block tracking-wide underline my-6">Continue shopping</a>
      </Link>

      <table className={classNames(styles.cartTable)}>
        <thead>
          <tr className="text-left">
            <th>Product</th>
            <th className={styles.priceCol}>Price</th>
            <th className={styles.hiddenOnMobile}>Quantity</th>
            <th className={classNames(styles.totalCol, styles.hiddenOnMobile)}>Total</th>
          </tr>
        </thead>

        <tbody>
          {_.map(cart, (cartItem) => {
            const product = _.find(products, { handle: cartItem.handle })
            const price = getPriceOfProduct(product)
            const quantity = cartItem.quantity

            return (
              <tr key={product.handle}>
                <td>
                  <div className="flex">
                    <Link href={`/products/${product.handle}`}>
                      <a>
                        <ProductImage className="w-24 h-auto" product={product} />
                      </a>
                    </Link>
                    <div className="ml-8 text-sm md:text-lg">
                      <Link href={`/products/${product.handle}`}>
                        <a className="hover:underline">
                          <h4 className="font-bold">{product.title}</h4>
                        </a>
                      </Link>

                      <a
                        className="underline"
                        onClick={() =>
                          remove({
                            handle: product.handle,
                            variantId: getVariantId(product),
                          })
                        }
                      >
                        Remove
                      </a>
                    </div>
                  </div>
                </td>
                <td className={styles.priceCol}>
                  <div>
                    <ProductPrice product={product} />

                    <div className="mt-4 block md:hidden">
                      <span className="mr-2 text-sm">Qty</span>

                      <QtyInput cartItem={cartItem} onChange={setQuantity} />
                    </div>
                  </div>
                </td>
                <td className={styles.hiddenOnMobile}>
                  <QtyInput cartItem={cartItem} onChange={setQuantity} />
                </td>
                <td className={classNames(styles.totalCol, styles.hiddenOnMobile)}>{formatYen(quantity * price)}</td>
              </tr>
            )
          })}

          <tr className={classNames(styles.noBorder, styles.hiddenOnMobile)}>
            <td />
            <td />
            <td>Subtotal</td>
            <td className={styles.totalCol}>{formatYen(subTotalOfCart(cart))} JPY</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-10 mb-4 flex items-center justify-center md:hidden">
        <span className="mx-4 inline-block">Subtotal</span>
        <span className="mx-4 inline-block">{formatYen(subTotalOfCart(cart))} JPY</span>
      </p>

      <p className="text-sm text-center md:text-right">Taxes and shipping calculated at checkout</p>

      <div className="mt-12 md:mt-16 flex flex-col md:flex-row justify-end">
        <Button onClick={() => empty()} bordered>
          Empty Cart
        </Button>

        <Button
          className={classNames('mt-6 md:ml-6 md:mt-0', styles.checkoutBtn, { 'pointer-events-none': isSubmitting })}
          onClick={onCheckout}
          filled
        >
          Check Out
        </Button>
      </div>

      {isSubmitting && (
        <div className={styles.backdrop}>
          <Loader />
        </div>
      )}
    </Layout>
  )
}

export default render
