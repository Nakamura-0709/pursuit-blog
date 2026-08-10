import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { PaginationInfo } from "@/types/article";

interface PaginationProps {
	pagination: PaginationInfo;
	onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
	const { currentPage, totalPages, hasNext, hasPrev } = pagination;

	if (totalPages <= 1) return null;

	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const start = Math.max(1, currentPage - 2);
			const end = Math.min(totalPages, start + maxVisible - 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}

		return pages;
	};

	return (
		<div className="flex justify-center items-center space-x-1 sm:space-x-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={!hasPrev}
				className="glass-interactive border-white/20 hover:border-white/40 w-8 h-8 sm:w-9 sm:h-9 p-0"
			>
				<ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" />
			</Button>

			{getPageNumbers().map((page) => (
				<Button
					key={page}
					variant={page === currentPage ? "default" : "outline"}
					size="sm"
					onClick={() => onPageChange(page)}
					className={`${
						page === currentPage
							? "bg-primary text-primary-foreground"
							: "glass-interactive border-white/20 hover:border-white/40"
					} w-8 h-8 sm:w-9 sm:h-9 p-0 text-xs sm:text-sm`}
				>
					{page}
				</Button>
			))}

			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={!hasNext}
				className="glass-interactive border-white/20 hover:border-white/40 w-8 h-8 sm:w-9 sm:h-9 p-0"
			>
				<ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
			</Button>
		</div>
	);
}
