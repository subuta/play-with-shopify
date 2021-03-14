import _ from 'lodash'
import crypto from 'crypto'

import { GraphQLClient, gql } from 'graphql-request'

import axios from './axios'

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET
const SHOPIFY_API_SHOP_DOMAIN = process.env.SHOPIFY_API_SHOP_DOMAIN
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION

// Not used, We need StoreFront API for checkout, and used that instead.
// GraphQL Client used for access Admin API.
const adminClient = new GraphQLClient(
  `https://${SHOPIFY_API_SHOP_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
  {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_API_SHOP_ACCESS_TOKEN,
    },
  }
)

// GraphQL Client used for access Admin API.
const storefrontClient = new GraphQLClient(
  `https://${SHOPIFY_API_SHOP_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_API_STOREFRONT_ACCESS_TOKEN,
    },
  }
)

// Check query signature of Shopify request.
// SEE: https://github.com/benzookapi/shopify-product-tax/blob/master/app.js#L466-L479
// SEE For Webhook: https://github.com/benzookapi/shopify-product-tax/blob/master/app.js#L497-L509
const checkQuerySignature = (rawQuery) => {
  let query = _.cloneDeep(rawQuery)
  if (!query.hmac) return false
  let sig = query.hmac
  delete query.hmac
  let msg = Object.entries(query)
    .sort()
    .map((e) => e.join('='))
    .join('&')
  const hmac = crypto.createHmac('sha256', SHOPIFY_API_SECRET)
  hmac.update(msg)
  return hmac.digest('hex') === sig
}

// Get OAuth access token for shop.
const getAccessTokenOfShop = (shop, code) => {
  const accessTokenEndpoint = `https://${shop}/admin/oauth/access_token`

  return axios
    .post(accessTokenEndpoint, {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    })
    .then(({ data }) => data)
}

const queryGqlAdminApi = (query, variables = {}) => {
  return adminClient.request(query, variables)
}

const queryGqlStorefrontApi = (query, variables = {}) => {
  return storefrontClient.request(query, variables)
}

const getVariantId = (product) => {
  return _.get(product, ['variants', 'edges', 0, 'node', 'id'])
}

const doCheckout = async (cart) => {
  const lineItems = _.map(cart, (cartItem) => _.pick(cartItem, ['variantId', 'quantity']))

  // Create checkout at shopify.
  const data = await queryGqlStorefrontApi(
    gql`
      mutation($lineItems: [CheckoutLineItemInput!]) {
        checkoutCreate(input: { lineItems: $lineItems }) {
          checkout {
            id
            webUrl
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    `,
    {
      lineItems,
    }
  )

  // Return received webUrl for further checkout flow.
  const webUrl = _.get(data, ['checkoutCreate', 'checkout', 'webUrl'])
  if (!webUrl) {
    throw new Error('Invalid cart state')
  }
  return webUrl
}

export { getVariantId, checkQuerySignature, getAccessTokenOfShop, queryGqlAdminApi, queryGqlStorefrontApi, doCheckout }
