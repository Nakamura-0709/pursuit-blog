import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { SlideIn } from "@/components/ui/slide-in";

export default function NotFound() {
	return (
		<div className="min-h-screen text-foreground">
			<Navbar />

			<main className="container mx-auto px-4 pt-32 pb-16">
				<div className="max-w-4xl mx-auto text-center">
					<SlideIn delay={100} duration={800} autoSlide={true}>
						<h1 className="text-6xl title-font mb-6 purple-accent">404</h1>
						<h2 className="text-3xl font-semibold mb-4">
							ページが見つかりません
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							お探しのページは存在しないか、移動された可能性があります。
						</p>
					</SlideIn>

					<SlideIn delay={300} duration={800} autoSlide={true}>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/"
								className="px-8 py-3 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg font-medium transition-colors"
							>
								ホームに戻る
							</Link>
							<Link
								href="/portfolio"
								className="px-8 py-3 bg-card hover:bg-card/80 text-foreground border border-border rounded-lg font-medium transition-colors"
							>
								Portfolioを見る
							</Link>
						</div>
					</SlideIn>
				</div>
			</main>
		</div>
	);
}
