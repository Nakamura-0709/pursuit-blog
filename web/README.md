# web

`pursuit-blog.com` のフロントエンド。Next.js の静的エクスポート（`output: "export"`）で、S3 + CloudFront から配信する。

インフラは `private-aws` の `services/pursuit-blog/` で管理する。

## 前提条件

```bash
mise install    # Node.js 22
npm ci
```

## 操作手順

```bash
# 開発サーバー
npm run dev

# ビルド（out/ に静的ファイルを出力）
npm run build

# Lint / Format
npm run lint
npm run format
```

## 大体の流れ

1. `content/` に記事の Markdown を追加する
2. `public/images/articles/{portfolio,life}/thumbnails/` にサムネイルを置く
3. `npm run build` でビルドが通ることを確認する
4. PR を作成してマージする
5. `out/` を S3 へ同期し、CloudFront のキャッシュを削除する

```bash
export AWS_PROFILE=private-aws
BUCKET=$(aws ssm get-parameter --name /pb/prod/cdn/static_bucket_name --query Parameter.Value --output text)
DIST=$(aws ssm get-parameter --name /pb/prod/cdn/cloudfront_distribution_id --query Parameter.Value --output text)

# 実体の同期。--delete はここ1回だけ付ける
aws s3 sync out/ "s3://${BUCKET}/" --delete \
  --cache-control "public,max-age=31536000,immutable"

# HTML だけ短期キャッシュに上書き（--delete は付けない）
aws s3 sync out/ "s3://${BUCKET}/" --exclude "*" --include "*.html" \
  --cache-control "public,max-age=0,must-revalidate"

aws cloudfront create-invalidation --distribution-id "${DIST}" --paths "/*"
```

> 2回目に `--delete` を付けると、1回目で除外した分を消してしまう。

## 記事の追加

`content/portfolio/` または `content/life/` に `YYYY-MMDD.md` を置く。

```markdown
---
title: "記事タイトル"
date: 2026-08-11
description: "一覧とOGPに使われる説明文"
tags: ["タグ1", "タグ2"]
thumbnail: "/images/articles/portfolio/thumbnails/2026-0811.webp"
---

本文
```

`tags` は `data/config/tagCategoriesPortfolio.json` / `tagCategoriesLife.json` に定義済みの値を使う。定義外の値はフィルタに現れない。

サムネイルは **1200×630 の webp** にする（OGP 画像と兼用するため）。

## 構成

| ディレクトリ | 内容 |
|---|---|
| `src/app/` | ページ（App Router） |
| `src/components/ui/` | UIコンポーネント |
| `src/lib/` | 記事の読み込み・ユーティリティ |
| `content/` | 記事の Markdown |
| `data/config/` | タグの定義 |
| `public/images/` | 画像 |
| `scripts/` | ビルド前に走る生成スクリプト |

## API との関係

問い合わせフォームは `/api/contact` に POST する。**CloudFront が同一オリジンで API Gateway に流す**ため、ホストを環境変数で差し込む必要はない。

API の実装は `../api/` にある。

## 注意

- `npm run lint` は現在エラーが出る（Biome v2 移行に伴う既存コードの検出）。#16 で対応する
- 一部の記事でサムネイルの対応が崩れている。#17 で対応する
