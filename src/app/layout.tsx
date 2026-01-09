import '../styles/globals.css'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

export const metadata = {
  title: 'chendriksen',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2">Skip to content</a>
        <AppHeader />
        <main id="content">{children}</main>
        <AppFooter />
      </body>
    </html>
  )
}
