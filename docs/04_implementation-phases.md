# 実装フェーズと開発・コミットの詳細プラン

[docs/01_tech-stack.md](01_tech-stack.md) と [03_cursor-implementation-guide.md](03_cursor-implementation-guide.md) に基づき、Phase 0〜5 で開発を進めます。各フェーズごとに `feature/xxx` ブランチを作成し、完了時に PR で main にマージします。Phase 5 ではタグ（`v*`）による本番リリースを行います。

---

## Phase 0: プロジェクトの土台作り（初期セットアップ）

Cursor（AI）のブレを防ぎ、誰でも同じ環境で開発できるようにします。

- **ブランチ:** `main`（初回のみ直接コミット）
- **作業手順とコミット:**
  1. Cursor への指示書と仕様書の作成（プロジェクトルール `.cursor/rules/` と [01_tech-stack.md](01_tech-stack.md) 等）。
     → `docs: add cursor rules and architecture specifications`
  2. 開発環境のコンテナ化とツール群のバージョン固定（`.devcontainer/` と `mise.toml`）。
     → `chore: setup devcontainers and mise for local environment`
  3. 依存関係の自動更新ルールの追加（`.github/dependabot.yml`）。
     → `chore: configure dependabot for automated updates`
- **Push とデプロイ:** `git push origin main`。インフラはまだないのでデプロイは走りません。

---

## Phase 1: インフラ基盤の構築（Terraform）

環境（dev / prod）を分離したディレクトリ構造と、CI/CD のための認証基盤を作ります。

- **ブランチ:** `feature/iac-foundation`
- **作成するディレクトリ構造:**

```text
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf      # S3 Backend, Provider設定, モジュール呼び出し
│   │   ├── variables.tf
│   │   └── terraform.tfvars   # dev用の値 (CIDRなど)
│   └── prod/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars   # prod用の値
└── modules/
    ├── network/         # VPC, Subnet関連（あれば）
    ├── frontend/        # S3, CloudFront, ACM関連
    ├── backend/         # DynamoDB, API Gateway, Lambda(器のみ)
    └── cicd/            # OIDC用 IAM Role関連
```

- **作業手順とコミット:**
  1. dev / prod 分離ディレクトリと S3 ネイティブロックの設定。
     → `feat(infra): setup terraform directory structure and s3 backend`
  2. GitHub Actions 連携用の OIDC IAM ロール作成（`modules/cicd`）。
     → `feat(infra): create oidc iam roles for secure deployments`
- **Push とデプロイ:** `git push origin feature/iac-foundation` → GitHub 上で PR 作成 → レビュー（セルフ）して main へマージ。

---

## Phase 2: バックエンドの実装（Go + lambroll）

Terraform で器を作り、Go で中身を書き、lambroll でデプロイの関心を分離します。Lambda ランタイムは `provided.al2023` を使用します。

- **ブランチ:** `feature/backend-api`
- **作業手順とコミット:**
  1. Terraform 側（`modules/backend`）に DynamoDB、API Gateway、Lambda の器（`ignore_changes` 付き）を定義する。
     → `feat(infra): add dynamodb table and lambda dummy resource`
  2. Go モジュールの初期化、API ハンドラー実装、golangci-lint 設定。
     → `feat(api): implement go lambda handler and linter config`
  3. lambroll の設定（Terraform tfstate 参照）を追加する。
     → `feat(api): setup lambroll config for dynamic deployment`
- **Push とデプロイ:** `git push origin feature/backend-api` → PR 作成 → main へマージ。

---

## Phase 3: フロントエンドの実装（Next.js + Biome）

S3 + CloudFront のインフラを作り、静的サイトを構築します。

- **ブランチ:** `feature/frontend-web`
- **作業手順とコミット:**
  1. Terraform 側（`modules/frontend`）に S3 ホスティングと CloudFront (OAC) を定義する。
     → `feat(infra): add s3 hosting and cloudfront oac`
  2. Next.js 15 (SSG) の初期化と CSS Modules の採用。
     → `feat(web): initialize next.js static export project`
  3. Biome の導入（Lint/Format を Biome に統一）。
     → `chore(web): integrate biome for fast formatting and linting`
- **Push とデプロイ:** `git push origin feature/frontend-web` → PR 作成 → main へマージ。

---

## Phase 4: CI/CD パイプラインの構築（GitHub Actions）

これまで手動で確認していた Lint やデプロイを自動化し、dev 環境への自動反映の仕組みを作ります。

- **ブランチ:** `feature/cicd-automation`
- **作業手順とコミット:**
  1. Terraform の Lint（tflint / trivy）と Plan / Apply ワークフローを追加する。
     → `ci: add terraform lint, plan, and dev apply workflows`
  2. バックエンドとフロントエンドの Lint / Build / Deploy ワークフローを追加する。
     → `ci: add application ci/cd workflows for dev environment`
- **Push とデプロイ:** `git push origin feature/cicd-automation` → PR 作成 → main へマージ。
- **状態:** この時点で main ブランチにマージされると、自動的に**開発環境（dev）**へのデプロイが走ります。

---

## Phase 5: 初回リリースと本番デプロイ（タグ運用開始）

dev 環境での動作確認が完了したら、本番（prod）へのデプロイを行います。

- **作業:** ローカル（または GitHub UI 上）でリリースタグを作成する。
- **ステップ:**
  1. 最初のバージョンタグを打つ。
     → `git tag v1.0.0`
     → `git push origin v1.0.0`
  2. GitHub Actions が `v*` タグを検知し、**本番環境（prod）** の Terraform Apply とアプリケーションのデプロイを自動実行する。
  3. GitHub のリリースページで「Generate release notes」をクリックし、これまでの `feat:` や `fix:` からチェンジログを自動生成して公開する。
