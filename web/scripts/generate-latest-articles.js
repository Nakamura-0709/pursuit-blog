const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(__dirname, "..", "content");
const OUTPUT_FILE = path.join(
	__dirname,
	"..",
	"public",
	"latest-articles.json",
);

// 記事を読み込む関数
function getArticle(category, slug) {
	try {
		const filePath = path.join(CONTENT_DIR, category, `${slug}.md`);
		if (!fs.existsSync(filePath)) {
			return null;
		}

		const fileContent = fs.readFileSync(filePath, "utf8");
		const { data } = matter(fileContent);

		return {
			slug,
			title: data.title || "",
			date: data.date || "",
			tags: data.tags || [],
			description: data.description || "",
			thumbnail: data.thumbnail || null,
			category,
		};
	} catch (error) {
		console.error(`Failed to load article ${slug}:`, error);
		return null;
	}
}

// カテゴリの全記事を取得
function getArticles(category) {
	try {
		const articlesDir = path.join(CONTENT_DIR, category);
		if (!fs.existsSync(articlesDir)) {
			console.warn(`Articles directory not found: ${articlesDir}`);
			return [];
		}

		const filenames = fs.readdirSync(articlesDir);
		const articles = filenames
			.filter(
				(filename) =>
					filename.endsWith(".md") && !filename.startsWith("template_"),
			)
			.map((filename) => {
				const slug = filename.replace(".md", "");
				return getArticle(category, slug);
			})
			.filter((article) => article !== null)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return articles;
	} catch (error) {
		console.error(`Failed to load articles for ${category}:`, error);
		return [];
	}
}

// メイン処理
function generateLatestArticles() {
	try {
		console.log("Generating latest articles...");

		// lifeとportfolioからそれぞれ3件ずつ最新記事を取得
		const lifeArticles = getArticles("life").slice(0, 3);
		const portfolioArticles = getArticles("portfolio").slice(0, 3);

		console.log(`Found ${lifeArticles.length} life articles`);
		console.log(`Found ${portfolioArticles.length} portfolio articles`);

		// 両方の記事を結合して日付順にソート
		const allArticles = [...lifeArticles, ...portfolioArticles].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);

		// JSONファイルに出力
		fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allArticles, null, 2), "utf8");

		console.log(`Generated ${allArticles.length} articles in ${OUTPUT_FILE}`);
		console.log(
			"Articles:",
			allArticles.map((a) => ({
				title: a.title,
				category: a.category,
				date: a.date,
			})),
		);
	} catch (error) {
		console.error("Failed to generate latest articles:", error);
		process.exit(1);
	}
}

// スクリプトが直接実行された場合のみ実行
if (require.main === module) {
	generateLatestArticles();
}

module.exports = { generateLatestArticles };
