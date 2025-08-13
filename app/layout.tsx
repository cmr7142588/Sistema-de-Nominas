import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { MainNavigation } from "@/components/main-navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Nóminas",
  description: "Sistema integral de gestión de nóminas y empleados",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <MainNavigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
