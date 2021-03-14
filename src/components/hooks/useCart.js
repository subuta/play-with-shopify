import { useState, useEffect } from 'react'

import { createContainer } from 'unstated-next'

import { saveCart, loadCart } from '@/utils/session'

const useCart = () => {
  const [isCartLoaded, setIsCartLoaded] = useState(false)
  const [cart, setCart] = useState([])

  const setAndSaveCart = (items) => {
    saveCart(items)
    setCart(items)
  }

  // Load last cart from session at mount.
  useEffect(() => {
    setCart(loadCart() || [])
    setIsCartLoaded(true)
  }, [])

  const findExisting = (cart, cartItem) => _.find(cart, { handle: cartItem.handle })

  const getQuantity = (cart, cartItem) => {
    return _.get(findExisting(cart, cartItem), 'quantity', 0)
  }

  const setQuantity = (cart, cartItem, quantity) => {
    let nextCart = _.cloneDeep(cart)
    let found = findExisting(nextCart, cartItem)

    if (quantity === 0) {
      remove(cartItem)
      return
    }

    if (!found) {
      nextCart.push(cartItem)
      found = cartItem
    }
    found.quantity = quantity
    setAndSaveCart(nextCart)
  }

  const add = (cartItem) => {
    // Increment quantity if exists or set "1" for new item.
    setQuantity(cart, cartItem, getQuantity(cart, cartItem) + 1)
  }

  const remove = (cartItem) => {
    setAndSaveCart(_.reject(cart, { handle: cartItem.handle }))
  }

  const empty = () => {
    setAndSaveCart([])
  }

  return {
    cart,
    isCartLoaded,
    add,
    remove,
    empty,
    setQuantity: (cartItem, quantity) => setQuantity(cart, cartItem, quantity),
  }
}

export default createContainer(useCart)
