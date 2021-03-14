import React from 'react'
import _ from 'lodash'

import Link from 'next/link'

import classNames from 'classnames'

import styles from './index.module.css'

const render = (props) => {
  const { className, children, onClick = _.noop, href = '', bordered = false, filled = false } = props

  const tag = href ? 'a' : 'button'

  let component = React.createElement(
    tag,
    {
      className: classNames(styles.base, className, {
        [styles.bordered]: bordered,
        [styles.filled]: filled,
      }),
      onClick,
    },
    children
  )

  if (href) {
    // Wrap next's Link tag and pass href to child 'a' tag.
    component = (
      <Link href={href} passHref>
        {component}
      </Link>
    )
  }

  return component
}

export default render
