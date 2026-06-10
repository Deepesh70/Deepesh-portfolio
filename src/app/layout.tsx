import type { Metadata } from "next";
import { Inter, Roboto, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ─── Brand Fonts ─────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// ─── SEO Metadata ────────────────────────────────────────

export const metadata: Metadata = {
  title: "Deepesh | Developer Portfolio",
  description:
    "Interactive Windows 11-style portfolio showcasing projects, skills, and experience. Built with Next.js, React, and TypeScript.",
  keywords: ["developer", "portfolio", "react", "nextjs", "frontend", "windows"],
  authors: [{ name: "Deepesh" }],
  openGraph: {
    title: "Deepesh | Developer Portfolio",
    description: "Interactive Windows 11-style portfolio.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Deepesh Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deepesh | Developer Portfolio",
    description: "Interactive Windows 11-style portfolio.",
    images: ["/og-image.png"],
  },
};

// ─── Root Layout ─────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${roboto.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Prevent dark mode flash — runs before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = JSON.parse(localStorage.getItem('theme-preference') || '{}');
                  var mode = stored.state && stored.state.mode ? stored.state.mode : 'system';
                  if (mode === 'system') {
                    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full overflow-hidden font-body">{children}</body>
    </html>
  );
}
