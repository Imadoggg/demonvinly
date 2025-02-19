import './globals.css'
import { SessionProviderWrapper } from './SessionProviderWrapper'

export const metadata = {
  title: 'Vinyl Player',
  description: 'A Spotify-powered vinyl player interface',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}