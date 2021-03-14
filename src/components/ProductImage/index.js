import React from 'react'
import _ from 'lodash'

const render = ({ product, className }) => {
  const defaultImage = _.get(product, ['images', 'edges', 0, 'node'])
  return <img className={className || ''} src={defaultImage.transformedSrc} alt="" />
}

export default render
