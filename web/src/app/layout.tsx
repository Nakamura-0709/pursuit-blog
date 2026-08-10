import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/ui/footer";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
	fallback: ["system-ui", "arial"],
	preload: true,
	adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
	display: "swap",
	fallback: [
		"ui-monospace",
		"SFMono-Regular",
		"Consolas",
		"Liberation Mono",
		"Menlo",
		"monospace",
	],
	preload: true,
	adjustFontFallback: true,
});

export const metadata: Metadata = {
	// OGPやcanonicalの相対パスを絶対URLに解決するために必要
	metadataBase: new URL("https://pursuit-blog.com"),
	title: {
		default: "Pursuit - Portfolio & Blog",
		template: "%s | Pursuit",
	},
	description:
		"Welcome to Pursuit. Explore my journey and experience in web development.",
	robots: "index, follow",
};

// Next.js 14以降、viewportはmetadataから分離して定義する
// https://nextjs.org/docs/app/api-reference/functions/generate-viewport
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
			>
				{children}
				<Footer />
			</body>
		</html>
	);
}
