"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Article } from "@/types/article";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ImageIcon } from "lucide-react";
import { memo } from "react";

interface ArticleCardProps {
	article: Article;
	onTagClick?: (tag: string) => void;
}

export const ArticleCard = memo(function ArticleCard({
	article,
	onTagClick,
}: ArticleCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString("ja-JP", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return dateString;
		}
	};

	const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
		const card = cardRef.current;
		if (!card) return;

		const rect = card.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height) * 1.5;
		const x = event.clientX - rect.left - size / 2;
		const y = event.clientY - rect.top - size / 2;

		const ripple = document.createElement("div");
		ripple.style.position = "absolute";
		ripple.style.borderRadius = "50%";
		ripple.style.background = "rgba(138, 43, 226, 0.3)";
		ripple.style.width = `${size}px`;
		ripple.style.height = `${size}px`;
		ripple.style.left = `${x}px`;
		ripple.style.top = `${y}px`;
		ripple.style.transform = "scale(0)";
		ripple.style.opacity = "1";
		ripple.style.pointerEvents = "none";
		ripple.style.zIndex = "10";
		ripple.style.transition = "all 1.3s ease-out";

		card.appendChild(ripple);

		setTimeout(() => {
			ripple.style.transform = "scale(4)";
			ripple.style.opacity = "0";
		}, 10);

		setTimeout(() => {
			if (ripple.parentNode) {
				ripple.parentNode.removeChild(ripple);
			}
		}, 300);
	};

	const handleTagClick = (e: React.MouseEvent, tag: string) => {
		e.preventDefault();
		e.stopPropagation();
		if (onTagClick) {
			onTagClick(tag);
		}
	};

	return (
		<Link href={`/${article.category}/${article.slug}`} className="block group">
			<Card
				ref={cardRef}
				className="h-full glass-interactive article-card overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-2xl"
				onClick={createRipple}
			>
				<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10 pointer-events-none" />

				<div className="aspect-video overflow-hidden rounded-t-lg relative">
					{article.thumbnail ? (
						<img
							src={article.thumbnail}
							alt={article.title}
							className="w-full h-full object-cover article-card-image transition-transform duration-300 group-hover:scale-110"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.style.display = "none";
								const parent = target.parentElement;
								if (parent) {
									parent.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center text-muted-foreground no-image-placeholder">
                      <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="text-sm font-medium">No Image</span>
                    </div>
                  `;
								}
							}}
						/>
					) : (
						<div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground no-image-placeholder">
							<ImageIcon className="w-12 h-12 mb-2" />
							<span className="text-sm font-medium">No Image</span>
						</div>
					)}
				</div>

				<CardHeader className="pb-2 relative z-20 p-4 sm:p-6">
					<CardTitle className="text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
						{article.title}
					</CardTitle>
					<div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
						<CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
						<time dateTime={article.date}>{formatDate(article.date)}</time>
					</div>
				</CardHeader>
				<CardContent className="pt-0 relative z-20 px-4 sm:px-6 pb-4 sm:pb-6">
					<CardDescription className="line-clamp-3 mb-4 text-sm sm:text-base">
						{article.description}
					</CardDescription>
					<div className="flex flex-wrap gap-1.5 sm:gap-2">
						{article.tags.map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="text-xs cursor-pointer hover:bg-primary/80 transition-colors duration-200 px-2 py-1 sm:px-2.5 sm:py-1"
								onClick={(e) => handleTagClick(e, tag)}
							>
								{tag}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
});
