import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
  openGraph: {
    title: "SOS Pet - Serviços Pet e Achados & Perdidos",
    description: "Encontre os melhores serviços para seu pet e ajude a reunir famílias",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
