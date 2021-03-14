import { checkQuerySignature, getAccessTokenOfShop } from '@/utils/shopify'

// Not used, Can't access StoreFront API From Custom App :(, Kept for future reference.
// For Custom App authorization.
export default async function handler(req, res) {
  const { query } = req
  if (!checkQuerySignature(query)) {
    return res.status(400)
  }

  const { shop, code } = query
  const response = await getAccessTokenOfShop(shop, code)

  console.log('====')
  console.log(
    'Store following shopAccessToken as "SHOPIFY_API_SHOP_ACCESS_TOKEN" environment variable for further step'
  )
  console.log('shopAccessToken = ', response['access_token'])
  console.log('====')

  res.status(200).json({})
}
