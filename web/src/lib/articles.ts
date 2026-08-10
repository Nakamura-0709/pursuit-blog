import type { Article, TagCategories, ArticleFilter } from "@/types/article";

// 記事をフィルタリング
export function filterArticles(
	articles: Article[],
	filter: ArticleFilter,
	tagCategories: TagCategories,
): Article[] {
	return articles.filter((article) => {
		// カテゴリフィルタ
		if (filter.category) {
			const categoryTags = tagCategories[filter.category] || [];
			if (!article.tags.some((tag) => categoryTags.includes(tag))) {
				return false;
			}
		}

		// タグフィルタ（複数タグ対応・AND条件）
		if (filter.tags && filter.tags.length > 0) {
			// 選択されたタグの全てが記事のタグに含まれている場合（AND条件）
			if (
				!filter.tags.every((selectedTag) => article.tags.includes(selectedTag))
			) {
				return false;
			}
		}

		// 検索フィルタ
		if (filter.search) {
			const searchTerm = filter.search.toLowerCase();
			const searchableText =
				`${article.title} ${article.description} ${article.tags.join(" ")}`.toLowerCase();
			if (!searchableText.includes(searchTerm)) {
				return false;
			}
		}

		return true;
	});
}

// ページネーション用に記事を分割
export function paginateArticles(
	articles: Article[],
	page: number,
	itemsPerPage: number = 9,
) {
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const totalPages = Math.ceil(articles.length / itemsPerPage);

	return {
		articles: articles.slice(startIndex, endIndex),
		pagination: {
			currentPage: page,
			totalPages,
			totalItems: articles.length,
			itemsPerPage,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		},
	};
}
