const SESSION_CART_KEY = 'play-with-shopify.cart'

const isSSR = typeof window === 'undefined'

const tryJsonParse = (str) => {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

const saveCart = (value) => {
  sessionStorage.setItem(SESSION_CART_KEY, JSON.stringify(value))
}

const loadCart = () => {
  if (isSSR) return null
  return tryJsonParse(sessionStorage.getItem(SESSION_CART_KEY)) || null
}

export { saveCart, loadCart }

export default {
  saveCart,
  loadCart,
}
