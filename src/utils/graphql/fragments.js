import { gql } from 'graphql-request'

const PRODUCT_FRAGMENT = gql`
  fragment productDetails on Product {
    handle
    title
    descriptionHtml

    images(first: 1) {
      edges {
        node {
          transformedSrc
          altText
        }
      }
    }

    variants(first: 1) {
      edges {
        node {
          id
          priceV2 {
            amount
            currencyCode
          }
        }
      }
    }
  }
`

export { PRODUCT_FRAGMENT }

export default {
  PRODUCT_FRAGMENT,
}
