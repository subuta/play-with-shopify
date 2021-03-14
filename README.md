# play-with-shopify

Custom storefront implementation with Shopify.

## How to develop Private App (with Storefront API)

"Private App" is required for use "StoreFront API" (and "CustomApp" is not enough).  

1. Create "Private App" from Store admin page.
2. Enable "Storefront API" section's "Allow this app to access your storefront data using the Storefront API" option.
3. Hit "Save".
4. Copy "Storefront access token" from admin page and store that as `SHOPIFY_API_STOREFRONT_ACCESS_TOKEN` Environment variable.
5. Restart dev server for applying environment variables change.

## (For future reference) How to develop Custom App

### 1. Setup shopify app

1. Create "Custom App" from Shopify's Partner Dashboard or Store admin page.
2. Set following fields and Hit "Save"
   1. App URL: `http://localhost:3000/api/auth/install`
   2. Allowed redirection URL(s): `http://localhost:3000/api/auth/callback`
3. After "Custom App" are created, fetch these values from app page and fill `.env`.
   1. API key -> `SHOPIFY_API_KEY`
   2. API secret key -> `SHOPIFY_API_SECRET`

### 2. Start dev server

```
# Install dependencies
npm i

# Run development server
npm run dev
```

### 3. Install CustomApp to your store

1. Copy `Merchant install link` from app page and open that URL in your Browser.
2. When "Authorization page" is shown, hit "Install app" link.
3. See dev server's console log for generated `shopAccessToken`. and store that as `SHOPIFY_API_SHOP_ACCESS_TOKEN` Environment variable.
4. Restart dev server for applying environment variables change.
