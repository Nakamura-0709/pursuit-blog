# 開発の流れ

このドキュメントは**開発プロセス**（環境構築・ブランチ・PR・テスト・デプロイの運用）を定義します。実装時はこの手順に沿って進めてください。Cursor で何をどの順に実装するかは [03_cursor-implementation-guide.md](03_cursor-implementation-guide.md) を参照してください。

## 環境構築

※ 具体的な手順（Dev Container の起動、mise の有効化、依存インストール、起動コマンドなど）は Phase 0 完了後に記載します。

- [ ] リポジトリのクローン
- [ ] 依存関係のインストール
- [ ] 環境変数・設定
- [ ] 起動コマンド

## ブランチ戦略

開発は「基盤（外枠）」から「実装（中身）」へ向かって進めます。フェーズごとに `feature/xxx` ブランチを作成し、完了時に PR（Pull Request）経由で main にマージする運用とします。

- 機能追加・インフラ追加: `feat/xxx`（例: `feat/iac-foundation`, `feat/backend-api`）
- バグ修正・設定修正: `fix/xxx`
- フェーズ別の作業手順・ブランチ名・コミット例の詳細は [04_implementation-phases.md](04_implementation-phases.md) を参照してください。

## コミット規約

**Conventional Commits** を採用し、**1 つのコミットには 1 つの論理的な変更のみ**を含める「アトミックコミット」を徹底します。

第三者（採用担当者や他のエンジニア）がリポジトリを見た際に「何のための変更か」がプレフィックスで一目で分かり、問題時は `git revert` も容易になります。

| プレフィックス | 用途                                           | コミットメッセージの例                             |
| -------------- | ---------------------------------------------- | -------------------------------------------------- |
| `feat:`        | 新機能の追加、インフラの新規リソース作成       | `feat(infra): add s3 backend for terraform state`  |
| `fix:`         | バグ修正、設定の誤り修正                       | `fix(api): resolve cors issue on contact endpoint` |
| `chore:`       | ツール設定、ビルド、依存関係（本番コード以外） | `chore: setup devcontainer and mise`               |
| `docs:`        | ドキュメントの追加・修正                       | `docs: add tech stack and architecture specs`      |
| `ci:`          | GitHub Actions など CI/CD 関連                 | `ci: add terraform plan workflow`                  |
| `refactor:`    | 仕様を変えずにコードを綺麗にする               | `refactor(web): extract contact form to component` |

## 開発〜PR

- 上記コミット規約に従い、**アトミックコミット**を徹底する（1 コミット = 1 論理的な変更）。
- PR テンプレート・レビュー基準は必要に応じて整備する。

## テスト

※ 単体テスト・E2E の実行コマンドとカバレッジ方針は Phase 0 完了後に記載します。

- 例: 単体テスト・E2E のコマンドと運用

## デプロイ

- **開発環境（dev）:** main ブランチへのマージで、GitHub Actions により自動デプロイされます。
- **本番環境（prod）:** タグ（例: `v1.0.0`）を push したときに GitHub Actions が検知し、本番への Terraform Apply とアプリケーションのデプロイを実行します。
- 手順の詳細は [04_implementation-phases.md](04_implementation-phases.md) の Phase 4（CI/CD）と Phase 5（リリース）を参照してください。
