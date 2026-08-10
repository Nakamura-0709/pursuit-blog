# api

問い合わせフォームのバックエンド。

インフラ（Lambdaの器・IAMロール・API Gateway）は `private-aws` の `services/pursuit-blog/` で管理し、
このディレクトリはコードとデプロイ設定のみを持つ。

## 構成

| ディレクトリ | 対応するLambda |
|---|---|
| `contact-api/` | `pb-contact-api-prod`（API Gateway経由の同期処理） |
| `contact-notifier/` | `pb-contact-notifier-prod`（DynamoDB Streams経由の非同期処理） |

`deploy/*/function.json` の値は **SSM Parameter Store（`/pb/prod/*`）から取得**する。
tfstateを直接読まない理由は、CIにtfstateバケットの読み取り権限を与えないため。

## デプロイ

```bash
mise install
export AWS_PROFILE=private-aws

# contact-api
cd contact-api && npm ci && npm run build && cd ..
lambroll deploy --function deploy/contact-api/function.json --src contact-api/dist

# contact-notifier
cd contact-notifier && npm ci && npm run build && cd ..
lambroll deploy --function deploy/contact-notifier/function.json --src contact-notifier/dist
```

## 注意

このコードは **TypeScript による暫定実装**。Go + arm64 への書き換えを予定している。
