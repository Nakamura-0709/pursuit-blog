import { Navbar } from "@/components/ui/navbar";
import { ArticlesGrid } from "@/components/ui/articles-grid";
import { getArticles, getTagCategories } from "@/lib/articles-server";
import { SlideIn } from "@/components/ui/slide-in";

export default function Life() {
	// Life記事を取得
	const articles = getArticles("life");
	const tagCategories = getTagCategories("life");

	return (
		<div className="min-h-screen text-foreground">
			<Navbar />

			{/* メインコンテンツ */}
			<main className="pt-20">
				<SlideIn delay={100} duration={800} autoSlide={true}>
					<ArticlesGrid
						articles={articles}
						tagCategories={tagCategories}
						title="Life"
					/>
				</SlideIn>
			</main>
		</div>
	);
}
