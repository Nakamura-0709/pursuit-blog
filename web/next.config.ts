import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// 開発時は静的エクスポートを無効、本番ビルド時のみ有効
	output: process.env.NODE_ENV === "production" ? "export" : undefined,
	images: {
		unoptimized: false,
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
		// CloudFrontでの画像配信を最適化
		domains: ["d1ntrwr4hdd7i1.cloudfront.net"],
		path: "/_next/image",
		loader: "default",
	},
	// 静的サイトでのルーティング改善
	trailingSlash: false,
	// 静的サイト生成時の設定（本番ビルド時のみ）
	distDir: process.env.NODE_ENV === "production" ? "out" : ".next",
	// カスタムヘッダーの設定（本番ビルド時のみ）
	...(process.env.NODE_ENV === "production" && {
		async headers() {
			return [
				{
					source: "/(.*)",
					headers: [
						{
							key: "Cache-Control",
							value: "public, max-age=3600, s-maxage=86400",
						},
					],
				},
			];
		},
	}),
};

export default nextConfig;
