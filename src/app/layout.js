import '../styles/globals.scss'
import '../styles/index.scss'
import '../styles/editor.scss'
import '../styles/components/BackgroundGradient.scss'

export const metadata = {
  title: 'TinkerHub Dynamic Display',
  description: 'A dynamic display web app for TV screens',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
