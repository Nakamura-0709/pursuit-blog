"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, FilterIcon, XIcon } from "lucide-react";
import type { ArticleFilter, TagCategories } from "@/types/article";

interface ArticleFiltersProps {
	tagCategories: TagCategories;
	allTags: string[];
	filter: ArticleFilter;
	onFilterChange: (filter: ArticleFilter) => void;
}

export function ArticleFilters({
	tagCategories,
	allTags,
	filter,
	onFilterChange,
}: ArticleFiltersProps) {
	const [showFilters, setShowFilters] = useState(false);

	const handleCategoryChange = (category: string) => {
		if (filter.category === category) {
			const { category: _, tags: __, ...newFilter } = filter;
			onFilterChange(newFilter);
		} else {
			const { tags: _, ...newFilter } = filter;
			onFilterChange({ ...newFilter, category });
		}
	};

	const handleTagChange = (tag: string) => {
		const currentTags = filter.tags || [];

		if (currentTags.includes(tag)) {
			// タグが既に選択されている場合は削除
			const filteredTags = currentTags.filter((t) => t !== tag);
			if (filteredTags.length === 0) {
				const { tags: _, ...newFilter } = filter;
				onFilterChange(newFilter);
			} else {
				onFilterChange({ ...filter, tags: filteredTags });
			}
		} else {
			// タグが選択されていない場合は追加
			onFilterChange({ ...filter, tags: [...currentTags, tag] });
		}
	};

	const handleSearchChange = (search: string) => {
		if (search.trim() === "") {
			const { search: _, ...newFilter } = filter;
			onFilterChange(newFilter);
		} else {
			onFilterChange({ ...filter, search });
		}
	};

	const clearFilters = () => {
		onFilterChange({});
	};

	const hasActiveFilters =
		filter.category || (filter.tags && filter.tags.length > 0) || filter.search;

	// 選択されたカテゴリに属するタグを取得
	const availableTags = filter.category
		? tagCategories[filter.category] || []
		: allTags;

	return (
		<div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
			{/* 検索バー */}
			<div className="relative">
				<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<Input
					placeholder="記事を検索..."
					value={filter.search || ""}
					onChange={(e) => handleSearchChange(e.target.value)}
					className="pl-10 bg-white/90 glass-interactive rounded-2xl border-2 border-gray-200/60 focus:border-white/40 text-base"
				/>
			</div>

			{/* フィルタトグルボタン */}
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowFilters(!showFilters)}
					className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/60 hover:border-blue-400/80 shadow-md shadow-gray-200/40 transition-all duration-200 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2"
				>
					<FilterIcon className="w-4 h-4 mr-2" />
					フィルタ
				</Button>

				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="text-muted-foreground hover:text-foreground hover:bg-white/10 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2"
					>
						<XIcon className="w-4 h-4 mr-1" />
						クリア
					</Button>
				)}
			</div>

			{/* フィルタ内容 */}
			{showFilters && (
				<div className="glass-interactive rounded-2xl p-4 sm:p-6">
					<div className="space-y-4">
						{/* カテゴリフィルタ */}
						<div>
							<h3 className="text-sm font-medium mb-2">カテゴリ</h3>
							<div className="flex flex-wrap gap-2">
								{Object.keys(tagCategories).map((category) => (
									<Badge
										key={category}
										variant={
											filter.category === category ? "default" : "secondary"
										}
										className="cursor-pointer hover:bg-primary/80 border-white/20 transition-colors text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1"
										onClick={() => handleCategoryChange(category)}
									>
										{category}
									</Badge>
								))}
							</div>
						</div>

						{/* タグフィルタ（複数選択対応） */}
						<div>
							<h3 className="text-sm font-medium mb-2">
								タグ{" "}
								{filter.tags && filter.tags.length > 0 && (
									<span className="text-xs text-muted-foreground">
										({filter.tags.length}個選択中)
									</span>
								)}
							</h3>
							<div className="flex flex-wrap gap-2">
								{availableTags.map((tag) => (
									<Badge
										key={tag}
										variant={
											filter.tags?.includes(tag) ? "default" : "secondary"
										}
										className="cursor-pointer hover:bg-primary/80 border-white/20 transition-colors text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1"
										onClick={() => handleTagChange(tag)}
									>
										{tag}
										{filter.tags?.includes(tag) && (
											<XIcon className="w-3 h-3 ml-1" />
										)}
									</Badge>
								))}
							</div>
							{filter.tags && filter.tags.length > 0 && (
								<p className="text-xs text-muted-foreground mt-2">
									選択されたタグの全てを含む記事が表示されます
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* アクティブフィルタ表示 */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2">
					{filter.category && (
						<Badge
							variant="default"
							className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1"
						>
							カテゴリ: {filter.category}
							<XIcon
								className="w-3 h-3 cursor-pointer"
								onClick={() =>
									filter.category && handleCategoryChange(filter.category)
								}
							/>
						</Badge>
					)}
					{filter.tags?.map((tag) => (
						<Badge
							key={tag}
							variant="default"
							className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1"
						>
							タグ: {tag}
							<XIcon
								className="w-3 h-3 cursor-pointer"
								onClick={() => handleTagChange(tag)}
							/>
						</Badge>
					))}
					{filter.search && (
						<Badge
							variant="default"
							className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1"
						>
							検索: {filter.search}
							<XIcon
								className="w-3 h-3 cursor-pointer"
								onClick={() => handleSearchChange("")}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}
