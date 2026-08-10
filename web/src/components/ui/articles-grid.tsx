"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ArticleCard } from "./article-card";
import { ArticleFilters } from "./article-filters";
import { Pagination } from "./pagination";
import { SlideIn } from "./slide-in";
import type { Article, ArticleFilter, TagCategories } from "@/types/article";
import { filterArticles, paginateArticles } from "@/lib/articles";

interface ArticlesGridProps {
	articles: Article[];
	tagCategories: TagCategories;
	title: string;
}

export function ArticlesGrid({
	articles,
	tagCategories,
	title,
}: ArticlesGridProps) {
	const [filter, setFilter] = useState<ArticleFilter>({});
	const [currentPage, setCurrentPage] = useState(1);
	const prevFilterRef = useRef<ArticleFilter>({});

	// 全タグを取得（メモ化）
	const allTags = useMemo(
		() => Array.from(new Set(articles.flatMap((article) => article.tags))),
		[articles],
	);

	// フィルタリングされた記事（メモ化）
	const filteredArticles = useMemo(
		() => filterArticles(articles, filter, tagCategories),
		[articles, filter, tagCategories],
	);

	// ページネーション（メモ化）
	const { articles: paginatedArticles, pagination } = useMemo(
		() => paginateArticles(filteredArticles, currentPage, 9),
		[filteredArticles, currentPage],
	);

	// フィルタが変更されたらページを1に戻す
	useEffect(() => {
		const prevFilter = prevFilterRef.current;
		const hasFilterChanged =
			prevFilter.category !== filter.category ||
			JSON.stringify(prevFilter.tags) !== JSON.stringify(filter.tags) ||
			prevFilter.search !== filter.search;

		if (hasFilterChanged) {
			setCurrentPage(1);
			prevFilterRef.current = filter;
		}
	}, [filter]);

	const handleFilterChange = useCallback((newFilter: ArticleFilter) => {
		setFilter(newFilter);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
		// ページ変更時にトップにスクロール
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const handleTagClick = useCallback(
		(tag: string) => {
			const currentTags = filter.tags || [];

			if (currentTags.includes(tag)) {
				// タグが既に選択されている場合は削除
				const filteredTags = currentTags.filter((t) => t !== tag);
				if (filteredTags.length === 0) {
					const { tags: _, ...newFilter } = filter;
					setFilter(newFilter);
				} else {
					setFilter({ ...filter, tags: filteredTags });
				}
			} else {
				// タグが選択されていない場合は追加
				setFilter({ ...filter, tags: [...currentTags, tag] });
			}
		},
		[filter],
	);

	return (
		<div className="container mx-auto px-4 sm:px-4 py-4 sm:py-8">
			{/* ヘッダー */}
			<SlideIn delay={0} duration={800} autoSlide={true}>
				<div className="text-center mb-8 sm:mb-12">
					<h1
						className="font-bold purple-accent mb-4"
						style={{
							fontSize: "clamp(2.5rem, 8vw, 5rem)",
							lineHeight: "0.9",
							letterSpacing: "-0.02em",
						}}
					>
						{title}
					</h1>
				</div>
			</SlideIn>

			{/* フィルタ */}
			<SlideIn delay={200} duration={800} autoSlide={true}>
				<ArticleFilters
					tagCategories={tagCategories}
					allTags={allTags}
					filter={filter}
					onFilterChange={handleFilterChange}
				/>
			</SlideIn>

			{/* 記事グリッド */}
			{paginatedArticles.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
						{paginatedArticles.map((article, index) => (
							<SlideIn
								key={article.slug}
								delay={400 + index * 100}
								duration={600}
								autoSlide={true}
							>
								<ArticleCard article={article} onTagClick={handleTagClick} />
							</SlideIn>
						))}
					</div>

					{/* ページネーション */}
					<SlideIn
						delay={400 + paginatedArticles.length * 100}
						duration={600}
						autoSlide={true}
					>
						<Pagination
							pagination={pagination}
							onPageChange={handlePageChange}
						/>
					</SlideIn>
				</>
			) : (
				<SlideIn delay={400} duration={800} autoSlide={true}>
					<div className="text-center py-8 sm:py-12">
						<p className="text-muted-foreground text-base sm:text-lg">
							条件に一致する記事が見つかりませんでした。
						</p>
						<p className="text-muted-foreground mt-2 text-sm sm:text-base">
							フィルタを変更して再度お試しください。
						</p>
					</div>
				</SlideIn>
			)}
		</div>
	);
}
