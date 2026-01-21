import './globals.css'

export const metadata = {
  title: 'SaaS Video Editor - Professional Video Editing Platform',
  description: 'Create professional product launch and demo videos without video editing skills',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}