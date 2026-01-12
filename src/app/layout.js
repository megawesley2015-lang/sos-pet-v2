import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PWAInstaller from "@/components/PWAInstaller";
import EmergencyFAB from "@/components/FAB/EmergencyFAB";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SOS Pet - Encontre serviços pet e ajude a reunir famílias",
  description: "Plataforma completa para encontrar veterinários, pet shops, hotéis pet e muito mais. Também ajudamos a reencontrar pets perdidos.",
  keywords: "pet, veterinário, pet shop, cachorro, gato, perdido, encontrado, adoção, Guarujá, Santos",
  authors: [{ name: "SOS Pet" }],
  manifest: "/manifest.json",
  themeColor: "#20B2AA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SOS Pet",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "SOS Pet - Serviços Pet e Achados & Perdidos",
    description: "Encontre os melhores serviços para seu pet e ajude a reunir famílias",
    type: "website",
    locale: "pt_BR",
    siteName: "SOS Pet",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOS Pet - Serviços Pet e Achados & Perdidos",
    description: "Encontre os melhores serviços para seu pet e ajude a reunir famílias",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <GoogleAnalytics />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#20B2AA" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Apple PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SOS Pet" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        
        {/* Splash Screens iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1170-2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <PWAInstaller />
        <EmergencyFAB />
      </body>
    </html>
  );
}
