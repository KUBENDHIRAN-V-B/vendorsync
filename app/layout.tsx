import type { Metadata } from 'next'
import './globals.css'
import { FirebaseAuthProvider } from '../lib/firebase-auth-context'
import { CartProvider } from '../lib/cart-context'

const inter = { className: 'font-sans' }

export const metadata: Metadata = {
  title: 'VendorSync - Smart Supply Chain Platform',
  description: 'Revolutionize your street food business with IoT sensors, AI-powered analytics, and seamless supplier connections.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseAuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}