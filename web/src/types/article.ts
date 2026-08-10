export interface Article {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	description: string;
	thumbnail?: string;
	content: string;
	category: "portfolio" | "life";
}

export interface TagCategories {
	[category: string]: string[];
}

export interface ArticleFilter {
	category?: string;
	tags?: string[];
	search?: string;
}

export interface PaginationInfo {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	hasNext: boolean;
	hasPrev: boolean;
}
