import "@/styles/globals.css";
import "@/styles/prosemirror.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const title = "wordsmith - Notion-style WYSIWYG editor with AI-powered autocompletions";
const description =
  "wordsmith is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@steventey",
  },
  metadataBase: new URL("https://novel.sh"),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* <Providers>{children}</Providers> */}
        {children}
      </body>
    </html>
  );
}
