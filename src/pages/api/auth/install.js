import qs from 'qs'

import { checkQuerySignature } from '@/utils/shopify'

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY
const SHOPIFY_API_SCOPE = process.env.SHOPIFY_API_SCOPE
const BASE_URL = process.env.BASE_URL

// Not used, Can't access StoreFront API From Custom App :(, Kept for future reference.
// For Custom App authorization.
export default function handler(req, res) {
  const { query } = req
  if (!checkQuerySignature(query)) {
    return res.status(400)
  }

  const shop = query.shop

  const params = {
    client_id: SHOPIFY_API_KEY,
    scope: SHOPIFY_API_SCOPE,
    redirect_uri: `${BASE_URL}/api/auth/callback`,
  }

  res.redirect(`https://${shop}/admin/oauth/authorize?${qs.stringify(params)}`)
}
