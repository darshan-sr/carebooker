import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AntdRegistry } from '@ant-design/nextjs-registry';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carebooker",
  description: "Schedule appointments with your doctors easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark:bg-gray-700 ${inter.className}`}>
        <Providers><AntdRegistry>{children}</AntdRegistry></Providers>{" "}
      </body>
    </html>
  );
}
