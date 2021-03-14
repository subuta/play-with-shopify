import React from 'react'
import NotificationSystem from 'react-notification-system'
import _ from 'lodash'

import Cart from '@/components/hooks/useCart'
import Notification from '@/components/hooks/useNotification'

import Link from 'next/link'
import styles from './index.module.css'

const render = (props) => {
  const { cart } = Cart.useContainer()
  const { ref: notificationSystemRef } = Notification.useContainer()

  const { shop, collection } = props

  const cartCount = _.sumBy(cart, 'quantity')

  return (
    <>
      <header className="py-4 px-4 md:px-8 border-b">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a>
              <h2 className={styles.siteName}>{shop.name}</h2>
            </a>
          </Link>

          {collection && (
            <h2 className="text-lg font-bold text-gray-500 hidden md:block">"{collection.title}" Selection</h2>
          )}

          <Link href="/cart">
            <a className={styles.bag}>
              <i className="material-icons text-gray-700">shopping_bag</i>
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </a>
          </Link>
        </div>

        {collection && (
          <p className="mt-2 text-xs font-bold text-gray-500 block md:hidden">"{collection.title}" Selection</p>
        )}
      </header>

      <div className={styles.content}>{props.children}</div>

      <footer className="px-4 md:px-8 py-12 flex justify-end text-sm text-gray-600 bg-gray-100">
        <span>© 2021, {shop.name}</span>
      </footer>

      <NotificationSystem ref={notificationSystemRef} />
    </>
  )
}

export default render
