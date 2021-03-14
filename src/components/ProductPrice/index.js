import React from 'react'
import _ from 'lodash'
import { formatYen } from '@/utils/currency'

const getPriceOfProduct = (product) => {
  const defaultVariant = _.get(product, ['variants', 'edges', 0, 'node'])
  return parseFloat(_.get(defaultVariant, ['priceV2', 'amount'], '0'))
}

const render = ({ product, className }) => {
  return <span className={className || ''}>{formatYen(getPriceOfProduct(product))}</span>
}

export { getPriceOfProduct }

export default render
