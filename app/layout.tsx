import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import clsx from "clsx";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { getAllBlogPostDetails } from "@/lib/blogUtils";
config.autoAddCss = false;


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const blogContent = getAllBlogPostDetails()

  return (
    <html lang="en">
      <head />
      <body
        className={clsx(
          "bg-base font-sans antialiased min-h-screen",
          fontSans.variable
        )}
      >
        <div className="flex w-full">
          <Sidebar />
          <div className="relative flex flex-col w-[calc(100dvw-4rem)]">

            <Navbar blogContents={blogContent} />

            <main className="text-text mx-auto pt-8 w-11/12">
              {children}
            </main>

          </div>

        </div>

        <Footer />

      </body>
    </html>
  );
}
