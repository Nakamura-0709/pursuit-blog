# Homeページ画像配置ガイド

## 📁 ディレクトリ構造

```
frontend/public/images/home/
├── hero/           # ヒーローセクション用画像
├── cards/          # カード（About, Portfolio, Life, Contact）用画像
├── features/       # 機能紹介・セクション用画像
├── profile/        # プロファイル画像
└── decorative/     # 装飾・アクセント用画像
```

## 🎯 具体的な格納場所

### 1. **ヒーローセクション** (`hero/`)
```
hero/
├── hero-background.jpg     # メインの背景画像
├── hero-overlay.png        # オーバーレイ用画像
└── hero-accent.svg         # アクセント画像
```

**使用例:**
```jsx
// ヒーロー背景
<div style={{ backgroundImage: 'url(/images/home/hero/hero-background.jpg)' }}>
  <h1>Pursuit</h1>
</div>
```

### 2. **プロファイル画像** (`profile/`)
```
profile/
├── ai-kenpo.webp           # メインプロファイル画像
├── profile-alt.jpg        # 代替プロファイル画像
└── avatar.png             # アバター画像
```

**使用例:**
```jsx
// 円形プロファイル画像
<Image
  src="/images/home/profile/ai-kenpo.webp"
  alt="プロファイル画像"
  width={320}
  height={320}
  className="rounded-full"
/>
```

### 3. **カードセクション** (`cards/`)
```
cards/
├── about-card.jpg          # Aboutカード用画像
├── portfolio-card.jpg      # Portfolioカード用画像
├── life-card.jpg           # Lifeカード用画像
└── contact-card.jpg        # Contactカード用画像
```

**使用例:**
```jsx
// カード背景画像
<RippleCard
  className="rounded-xl p-6"
  style={{ backgroundImage: 'url(/images/home/cards/about-card.jpg)' }}
>
  <h3>About</h3>
</RippleCard>
```

### 4. **機能紹介セクション** (`features/`)
```
features/
├── tech-stack-showcase.jpg # 技術スタック紹介画像
├── work-process.png        # 作業プロセス説明画像
├── project-samples.jpg     # プロジェクト例画像
└── skills-demo.gif         # スキルデモンストレーション
```

**使用例:**
```jsx
// 機能紹介セクション
<div className="glass-interactive rounded-2xl p-8">
  <img src="/images/home/features/tech-stack-showcase.jpg" alt="技術スタック" />
  <h2>注目の作品</h2>
</div>
```

### 5. **装飾用画像** (`decorative/`)
```
decorative/
├── pattern-overlay.svg     # パターンオーバーレイ
├── geometric-shapes.svg    # 幾何学模様
├── accent-lines.svg        # アクセントライン
└── background-texture.png  # 背景テクスチャ
```

**使用例:**
```jsx
// 装飾的な背景パターン
<div className="relative">
  <img
    src="/images/home/decorative/pattern-overlay.svg"
    className="absolute inset-0 opacity-10"
    alt=""
  />
  {/* メインコンテンツ */}
</div>
```

## 📝 命名規則

### ファイル名の例
- `hero-background.jpg` - ヒーロー背景
- `ai-kenpo.webp` - プロファイル画像
- `about-card.jpg` - Aboutカード用
- `tech-showcase.png` - 技術紹介用
- `accent-pattern.svg` - アクセント用

### 推奨サイズ
| 用途 | 推奨サイズ | フォーマット |
|------|------------|--------------|
| ヒーロー背景 | 1920x1080px以上 | JPG/WebP |
| プロファイル画像 | 400x400px以上（正方形） | PNG/JPG |
| カード画像 | 300x200px または 400x300px | JPG/WebP |
| 機能紹介 | 600x400px または 800x600px | JPG/PNG |
| 装飾用 | スケーラブル | SVG推奨 |

## 🚀 使用開始手順

1. **画像ファイルを適切なディレクトリに配置**
   ```bash
   # 例：プロファイル画像を配置
   cp ai-kenpo.webp frontend/public/images/home/profile/ai-kenpo.webp
   ```

2. **コンポーネントで画像を使用**
   ```jsx
   // Next.js Image コンポーネント推奨
   import Image from 'next/image';

   <Image
     src="/images/home/profile/ai-kenpo.webp"
     alt="プロファイル"
     width={320}
     height={320}
     className="rounded-full"
   />
   ```

3. **CSS背景画像として使用**
   ```jsx
   <div
     className="bg-cover bg-center h-96"
     style={{ backgroundImage: 'url(/images/home/hero/hero-background.jpg)' }}
   >
   ```

これで画像を配置する準備が整いました！
