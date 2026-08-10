import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// S3 + CloudFront で配信するため静的エクスポートする
	output: "export",

	// next/image の最適化はサーバーを必要とするため static export では動かない
	// formats / deviceSizes / imageSizes / minimumCacheTTL / loader を指定しても無視される
	images: {
		unoptimized: true,
	},

	// 拡張子なしのパス（例: /about）は CloudFront Function で .html に書き換える
	trailingSlash: false,
};

export default nextConfig;
