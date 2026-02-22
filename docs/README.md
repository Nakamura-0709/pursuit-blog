# pursuit-blog プロジェクトドキュメント

このディレクトリは、自作ブログ（pursuit-blog）の**事実の参照元**です。
採用技術・開発の流れ・アーキテクチャなどをここで一元管理し、人間と Cursor の両方が参照します。

## 目次

| ファイル | 内容 |
|----------|------|
| [01_tech-stack.md](01_tech-stack.md) | 採用技術一覧（フロント・バック・DB・インフラ・ツール）。バージョンや選定理由を記載。 |
| [02_development-flow.md](02_development-flow.md) | 開発プロセス（環境構築、ブランチ戦略、PR、テスト、デプロイの運用）。 |
| [03_cursor-implementation-guide.md](03_cursor-implementation-guide.md) | Cursor での実装の進め方（ルール・仕様書・段階的実装と Composer フェーズ例＝何をどの順で作るか）。 |
| [04_implementation-phases.md](04_implementation-phases.md) | 実装フェーズ別の開発・コミット・Push の詳細プラン（Phase 0〜5、タグによる本番リリース含む）。 |

開発時は **AGENTS.md** の指示に従い、まずこの `docs/` の内容を参照してから実装を進めてください。
