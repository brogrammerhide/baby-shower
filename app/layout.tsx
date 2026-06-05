import type { Metadata } from "next";
import { Nunito, Pacifico } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Summer Beach Baby Shower Registry",
  description: "Celebrating our little summer boy, arriving in July.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${pacifico.variable}`}>
      <body className="font-nunito text-deep antialiased min-h-screen">
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <defs>
            <symbol id="icon-wave" viewBox="0 0 24 24"><path d="M3 15c2.8-2.4 5.6-2.4 8.4 0s5.6 2.4 8.4 0"/><path d="M3 19c2.8-2.4 5.6-2.4 8.4 0s5.6 2.4 8.4 0"/><path d="M15 5c3.5 1.2 5.2 4.2 4.5 7.4-2-1.2-4.1-1.2-6.2.1 1.8-2.3 2.4-4.8 1.7-7.5Z"/></symbol>
            <symbol id="icon-shell" viewBox="0 0 24 24"><path d="M4 18c.7-6.8 4.1-11.5 8-11.5S19.3 11.2 20 18"/><path d="M5 18h14l-2 3H7l-2-3Z"/><path d="M12 6.5V18M8.2 9.2 10.4 18M15.8 9.2 13.6 18M5.9 13.2 9 18M18.1 13.2 15 18"/></symbol>
            <symbol id="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.7v2.1M12 19.2v2.1M4.1 4.1l1.5 1.5M18.4 18.4l1.5 1.5M2.7 12h2.1M19.2 12h2.1M4.1 19.9l1.5-1.5M18.4 5.6l1.5-1.5"/></symbol>
            <symbol id="icon-fish" viewBox="0 0 24 24"><path d="M3 12s4-5 10-5 8 5 8 5-2 5-8 5-10-5-10-5Z"/><path d="M3 12 7 8v8l-4-4ZM16 12h.01"/></symbol>
            <symbol id="icon-calendar" viewBox="0 0 24 24"><path d="M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Z"/><path d="M16 3v4M8 3v4M3 10h18"/></symbol>
            <symbol id="icon-umbrella" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0H4Z"/><path d="M12 12v8a2 2 0 0 0 4 0M8 12c.7-3 2-5.5 4-8 .9 2 1.6 4.6 2 8"/></symbol>
            <symbol id="icon-pin" viewBox="0 0 24 24"><path d="M12 21s7-4.7 7-11a7 7 0 1 0-14 0c0 6.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></symbol>
            <symbol id="icon-flower" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 4c2 2.2 2 4.2 0 6-2-1.8-2-3.8 0-6ZM12 20c-2-2.2-2-4.2 0-6 2 1.8 2 3.8 0 6ZM4 12c2.2-2 4.2-2 6 0-1.8 2-3.8 2-6 0ZM20 12c-2.2 2-4.2 2-6 0 1.8-2 3.8-2 6 0Z"/></symbol>
            <symbol id="icon-party" viewBox="0 0 24 24"><path d="M4 20 10 4l10 10L4 20Z"/><path d="M9 8l7 7M13 4c0-1.4 1.8-1.4 1.8 0 0 1.8 2.2 1.8 2.2 0M17 8c1.6-.8 2.8.7 1.7 1.8"/></symbol>
            <symbol id="icon-watermelon" viewBox="0 0 24 24"><path d="M4 8c2.1 6.3 5.3 9.5 8 9.5S17.9 14.3 20 8H4Z"/><path d="M6.2 8c1.6 4.4 3.8 6.8 5.8 6.8s4.2-2.4 5.8-6.8"/><path d="M10 11h.01M14 11h.01M12 14h.01"/></symbol>
            <symbol id="icon-moon" viewBox="0 0 24 24"><path d="M19 15.5A8 8 0 0 1 8.5 5a7 7 0 1 0 10.5 10.5Z"/><path d="M16 4v3M17.5 5.5h-3"/></symbol>
            <symbol id="icon-palm" viewBox="0 0 24 24"><path d="M12 10v11"/><path d="M12 10C8 6 5 6 3 8c4 0 6 1 9 2ZM12 10c4-4 7-4 9-2-4 0-6 1-9 2ZM12 10C11 5 8.5 3 6 3c2.5 2.3 4 4.4 6 7ZM12 10c1-5 3.5-7 6-7-2.5 2.3-4 4.4-6 7Z"/></symbol>
            <symbol id="icon-tent" viewBox="0 0 24 24"><path d="M3 20 12 4l9 16H3Z"/><path d="M12 4v16M12 20l4-7"/></symbol>
            <symbol id="icon-bottle" viewBox="0 0 24 24"><path d="M9 3h6v4l2 3v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9l2-3V3Z"/><path d="M9 7h6M8 13h5M8 17h4"/></symbol>
            <symbol id="icon-bib" viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M5 9c0 7 3 12 7 12s7-5 7-12M10 15h4"/></symbol>
            <symbol id="icon-caddy" viewBox="0 0 24 24"><path d="M5 9h14l-1 12H6L5 9Z"/><path d="M8 9a4 4 0 0 1 8 0M9 14h6"/></symbol>
            <symbol id="icon-bath" viewBox="0 0 24 24"><path d="M4 12h17l-2 7H7l-3-7Z"/><path d="M7 12V7a3 3 0 0 1 6 0M13 7h2M8 19v2M17 19v2"/></symbol>
            <symbol id="icon-star" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></symbol>
            <symbol id="icon-shirt" viewBox="0 0 24 24"><path d="M8 5 4 8l3 4 1-1v10h8V11l1 1 3-4-4-3-2 2h-4L8 5Z"/></symbol>
            <symbol id="icon-cloth" viewBox="0 0 24 24"><path d="M6 4h12v16H6z"/><path d="M6 9h12M10 4v16M14 4v16"/></symbol>
            <symbol id="icon-firstaid" viewBox="0 0 24 24"><path d="M7 7V5h10v2h4v14H3V7h4Z"/><path d="M12 11v6M9 14h6"/></symbol>
          </defs>
        </svg>
        {children}
        <ToastContainer position="bottom-right" theme="colored" />
      </body>
    </html>
  );
}
