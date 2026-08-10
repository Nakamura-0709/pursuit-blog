"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RippleCardProps {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

export function RippleCard({ children, className, onClick }: RippleCardProps) {
	const cardRef = useRef<HTMLButtonElement>(null);

	const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
		const card = cardRef.current;
		if (!card) return;

		const rect = card.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height) * 2;
		const x = event.clientX - rect.left - size / 2;
		const y = event.clientY - rect.top - size / 2;

		const ripple = document.createElement("span");
		ripple.className = "ripple";
		ripple.style.width = ripple.style.height = `${size}px`;
		ripple.style.left = `${x}px`;
		ripple.style.top = `${y}px`;

		card.appendChild(ripple);

		// アニメーション終了後に要素を削除
		setTimeout(() => {
			if (ripple.parentNode) {
				ripple.parentNode.removeChild(ripple);
			}
		}, 800);

		// onClickがある場合は実行
		if (onClick) {
			onClick();
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			// マウスイベントを模擬
			const rect = cardRef.current?.getBoundingClientRect();
			if (rect) {
				const mockEvent = {
					clientX: rect.left + rect.width / 2,
					clientY: rect.top + rect.height / 2,
				} as React.MouseEvent<HTMLButtonElement>;
				createRipple(mockEvent);
			}
		}
	};

	return (
		<button
			ref={cardRef}
			className={cn(
				"glass-interactive card-interactive ripple-effect cursor-pointer",
				className,
			)}
			onClick={createRipple}
			onKeyDown={handleKeyDown}
			type="button"
		>
			{children}
		</button>
	);
}
