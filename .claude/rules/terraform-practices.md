---
globs: ["**/*.tf", "**/*.hcl"]
---

# Terraform プラクティス

## State 管理

- **S3 ネイティブロック（v1.4 以降）のみ使用する**
- **DynamoDB は絶対に使用しない** — S3 バケット単体で排他制御が完結する

## 実装方針

- AWS プロバイダのベストプラクティスに従う
- リソースの依存関係は `depends_on` を活用して明示する
- `lifecycle` ブロックを活用して意図しないリソース削除を防ぐ
  - `prevent_destroy = true`: 本番リソース（RDS・S3・DynamoDB テーブル等）に設定する
  - `ignore_changes`: Lambda 関数の定義に設定し、インフラとアプリのデプロイを分離する
- 静的解析には **tflint** と **trivy** を使用する。checkov は採用しない

## 認証情報

- Access Key やパスワードなどのハードコードは **禁止**
- AWS 認証は OIDC による一時クレデンシャルを使用する
- シークレットは AWS Secrets Manager または環境変数で管理する

## 命名・構造

- 環境（dev / prod）はディレクトリで分離する（`terraform/environments/{dev,prod}/`）
- 共通リソースは `terraform/modules/` でモジュール化する
- 変数名・リソース名は snake_case で統一する
