import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Article, TagCategories } from "@/types/article";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CONFIG_DIR = path.join(process.cwd(), "data", "config");

// タグカテゴリ設定を読み込む
export function getTagCategories(type: "portfolio" | "life"): TagCategories {
	const configPath = path.join(
		CONFIG_DIR,
		`tagCategories${type.charAt(0).toUpperCase() + type.slice(1)}.json`,
	);

	try {
		if (!fs.existsSync(configPath)) {
			console.warn(`Config file not found: ${configPath}`);
			return {};
		}
		const configContent = fs.readFileSync(configPath, "utf8");
		return JSON.parse(configContent);
	} catch (error) {
		console.error(`Failed to load tag categories for ${type}:`, error);
		return {};
	}
}

// 単一記事を読み込む
export function getArticle(
	category: "portfolio" | "life",
	slug: string,
): Article | null {
	try {
		const filePath = path.join(CONTENT_DIR, category, `${slug}.md`);

		if (!fs.existsSync(filePath)) {
			console.warn(`Article file not found: ${filePath}`);
			return null;
		}

		const fileContent = fs.readFileSync(filePath, "utf8");
		const { data, content } = matter(fileContent);

		return {
			slug,
			title: data.title || "",
			date: data.date || "",
			tags: data.tags || [],
			description: data.description || "",
			thumbnail: data.thumbnail,
			content,
			category,
		};
	} catch (error) {
		console.error(`Failed to load article ${slug}:`, error);
		return null;
	}
}

// カテゴリの全記事を取得
export function getArticles(category: "portfolio" | "life"): Article[] {
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
			.filter((article): article is Article => article !== null)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return articles;
	} catch (error) {
		console.error(`Failed to load articles for ${category}:`, error);
		return [];
	}
}
