import { Navbar } from "@/components/ui/navbar";
import { ArticlesGrid } from "@/components/ui/articles-grid";
import { getArticles, getTagCategories } from "@/lib/articles-server";
import { SlideIn } from "@/components/ui/slide-in";

export default function Portfolio() {
	// Portfolio記事を取得
	const articles = getArticles("portfolio");
	const tagCategories = getTagCategories("portfolio");

	return (
		<div className="min-h-screen text-foreground">
			<Navbar />

			{/* メインコンテンツ */}
			<main className="pt-20">
				<SlideIn delay={100} duration={800} autoSlide={true}>
					<ArticlesGrid
						articles={articles}
						tagCategories={tagCategories}
						title="Portfolio"
					/>
				</SlideIn>
			</main>
		</div>
	);
}
