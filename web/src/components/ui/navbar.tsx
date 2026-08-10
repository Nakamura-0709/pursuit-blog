"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavbarProps {
	className?: string;
}

interface NavigationItem {
	href: string;
	label: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/portfolio", label: "Portfolio" },
	{ href: "/life", label: "Life" },
	{ href: "/contact", label: "Contact" },
];

export function Navbar({ className }: NavbarProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = useCallback(() => {
		setIsMobileMenuOpen((prev) => !prev);
	}, []);

	const closeMobileMenu = useCallback(() => {
		setIsMobileMenuOpen(false);
	}, []);

	const renderNavigationLink = (item: NavigationItem, isMobile = false) => (
		<Link
			key={item.href}
			href={item.href}
			onClick={isMobile ? closeMobileMenu : undefined}
		>
			<Button
				variant="ghost"
				size="sm"
				className={cn(
					"nav-link text-foreground hover:text-primary text-base",
					isMobile &&
						"w-full justify-start px-6 py-3 hover:bg-white/10 text-lg",
				)}
			>
				{item.label}
			</Button>
		</Link>
	);

	return (
		<nav
			className={cn(
				"fixed top-0 left-0 right-0 z-50",
				"flex items-center",
				"glass-nav px-6 py-2",
				"navbar-no-focus",
				className,
			)}
		>
			{/* 左側のロゴ */}
			<div className="flex items-center">
				<Link href="/" className="text-4xl title-font purple-accent">
					Pursuit
				</Link>
			</div>

			{/* 中央のナビゲーションリンク */}
			<div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
				{NAVIGATION_ITEMS.map((item) => renderNavigationLink(item))}
			</div>

			{/* モバイルメニューボタン */}
			<div className="md:hidden">
				<Button
					variant="ghost"
					size="sm"
					className="glass-hover"
					onClick={toggleMobileMenu}
					aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>
							{isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
						</title>
						{isMobileMenuOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</Button>
			</div>

			{/* モバイルメニュー */}
			{isMobileMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg">
					<div className="flex flex-col py-4">
						{NAVIGATION_ITEMS.map((item) => renderNavigationLink(item, true))}
					</div>
				</div>
			)}
		</nav>
	);
}
