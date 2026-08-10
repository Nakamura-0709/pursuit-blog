import { notFound } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideIn } from "@/components/ui/slide-in";
import Link from "next/link";
import { getArticle, getArticles } from "@/lib/articles-server";

interface LifePageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function LifePage({ params }: LifePageProps) {
	const { slug } = await params;
	const article = getArticle("life", slug);

	if (!article) {
		notFound();
	}

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

	return (
		<div className="min-h-screen text-foreground">
			<Navbar />

			<main className="container mx-auto px-4 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-16">
				<div className="max-w-4xl mx-auto">
					{/* 戻るボタン */}
					<SlideIn delay={100} duration={600} autoSlide={true}>
						<Link href="/life" className="inline-block mb-6 sm:mb-8">
							<Button
								variant="outline"
								className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/60 hover:border-blue-400/80 shadow-md shadow-gray-200/40 transition-all duration-200 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2"
							>
								<ArrowLeftIcon className="w-4 h-4 mr-2" />
								Life一覧に戻る
							</Button>
						</Link>
					</SlideIn>

					{/* 記事ヘッダー */}
					<SlideIn delay={200} duration={800} autoSlide={true}>
						<header className="mb-6 sm:mb-8">
							<h1 className="text-2xl sm:text-4xl font-bold mb-4 purple-accent">
								{article.title}
							</h1>

							<div className="flex items-center gap-4 mb-4 sm:mb-6 text-muted-foreground">
								<div className="flex items-center gap-2">
									<CalendarIcon className="w-4 h-4" />
									<time
										dateTime={article.date}
										className="text-sm sm:text-base"
									>
										{formatDate(article.date)}
									</time>
								</div>
							</div>

							<div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
								{article.tags.map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1"
									>
										{tag}
									</Badge>
								))}
							</div>

							{article.description && (
								<p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
									{article.description}
								</p>
							)}
						</header>
					</SlideIn>

					{/* 記事本文 */}
					<SlideIn delay={400} duration={800} autoSlide={true}>
						<article className="glass-card p-4 sm:p-8 rounded-lg">
							<MarkdownRenderer content={article.content} />
						</article>
					</SlideIn>
				</div>
			</main>
		</div>
	);
}

// 静的生成用の関数
export async function generateStaticParams() {
	const articles = getArticles("life");

	return articles.map((article) => ({
		slug: article.slug,
	}));
}
