import Head from 'next/head'

import Cart from '@/components/hooks/useCart'
import Notification from '@/components/hooks/useNotification'

import '@/css/tailwind.css'
import '@/css/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Roboto&display=swap"
          rel="stylesheet"
        />

        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <Cart.Provider>
        <Notification.Provider>
          <Component {...pageProps} />
        </Notification.Provider>
      </Cart.Provider>
    </>
  )
}

export default MyApp
