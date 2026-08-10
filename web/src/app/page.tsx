"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { SlideIn } from "@/components/ui/slide-in";
import type { Article } from "@/types/article";
import Image from "next/image";

// アニメーション定数
const ANIMATION_CONSTANTS = {
	SLIDE_IN_DELAY: 1000, // スライドイン開始までの遅延（ms）
	SLIDE_IN_DURATION: 2000, // スライドインの時間（ms）
	OPACITY_UPDATE_INTERVAL: 100, // 透明度更新の間隔（ms）
	OPACITY_STEP: 0.1, // 透明度の変化量
	FADE_ANIMATION_INTERVAL: 100, // フェードアニメーションの更新間隔（ms）
	FADE_ANIMATION_DURATION: 22000, // フェードアニメーションのループ時間（ms）
	SLIDE_IN_COMPLETION_DELAY: 3000, // スライドイン完了後の遅延（ms）
	FADE_START_DELAY: 5000, // フェードアニメーション開始までの遅延（ms）
	FADE_TRANSITION_DURATION: 4000, // フェードイン・アウトの時間（ms）
	FADE_DISPLAY_DURATION: 9000, // フェード表示維持時間（ms）
} as const;

// 画像位置の定数
const IMAGE_POSITIONS = {
	IMAGE1_LEFT: "65% 70%",
	IMAGE1_RIGHT: "75% 70%",
	IMAGE2_LEFT: "90% 30%",
	IMAGE2_RIGHT: "100% 30%",
} as const;

// カスタムフック：スライドインアニメーション
const useSlideInAnimation = () => {
	const [image1SlideIn, setImage1SlideIn] = useState(false);
	const [image2SlideIn, setImage2SlideIn] = useState(false);
	const [slideInOpacity, setSlideInOpacity] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			setImage1SlideIn(true);
			setImage2SlideIn(true);
		}, ANIMATION_CONSTANTS.SLIDE_IN_DELAY);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!image1SlideIn || !image2SlideIn) return;

		let opacity = 0;
		const opacityInterval = setInterval(() => {
			opacity += ANIMATION_CONSTANTS.OPACITY_STEP;
			if (opacity >= 1) {
				opacity = 1;
				clearInterval(opacityInterval);
			}
			setSlideInOpacity(opacity);
		}, ANIMATION_CONSTANTS.OPACITY_UPDATE_INTERVAL);

		return () => clearInterval(opacityInterval);
	}, [image1SlideIn, image2SlideIn]);

	return {
		image1SlideIn,
		image2SlideIn,
		slideInOpacity,
	};
};

// カスタムフック：フェードアニメーション
const useFadeAnimation = () => {
	const [image1LeftOpacity, setImage1LeftOpacity] = useState(0);
	const [image1RightOpacity, setImage1RightOpacity] = useState(1);
	const [image2LeftOpacity, setImage2LeftOpacity] = useState(0);
	const [image2RightOpacity, setImage2RightOpacity] = useState(1);

	useEffect(() => {
		let currentTime = 0;

		const interval = setInterval(() => {
			currentTime += ANIMATION_CONSTANTS.FADE_ANIMATION_INTERVAL;

			// ループ処理
			if (currentTime >= ANIMATION_CONSTANTS.FADE_ANIMATION_DURATION) {
				currentTime = 0;
			}

			// スライドインアニメーションが完了するまで透明度を変更しない
			if (currentTime < ANIMATION_CONSTANTS.SLIDE_IN_COMPLETION_DELAY) {
				return;
			}

			// 画像1の左側（65%位置）の透明度制御
			updateImageOpacity(
				currentTime,
				ANIMATION_CONSTANTS.FADE_START_DELAY,
				ANIMATION_CONSTANTS.FADE_TRANSITION_DURATION,
				ANIMATION_CONSTANTS.FADE_DISPLAY_DURATION,
				setImage1LeftOpacity,
			);

			// 画像1の右側（75%位置）の透明度制御
			updateImageOpacityReverse(
				currentTime,
				ANIMATION_CONSTANTS.FADE_START_DELAY,
				ANIMATION_CONSTANTS.FADE_TRANSITION_DURATION,
				ANIMATION_CONSTANTS.FADE_DISPLAY_DURATION,
				setImage1RightOpacity,
			);

			// 画像2の左側（90%位置）の透明度制御
			updateImageOpacity(
				currentTime,
				ANIMATION_CONSTANTS.FADE_START_DELAY,
				ANIMATION_CONSTANTS.FADE_TRANSITION_DURATION,
				ANIMATION_CONSTANTS.FADE_DISPLAY_DURATION,
				setImage2LeftOpacity,
			);

			// 画像2の右側（100%位置）の透明度制御
			updateImageOpacityReverse(
				currentTime,
				ANIMATION_CONSTANTS.FADE_START_DELAY,
				ANIMATION_CONSTANTS.FADE_TRANSITION_DURATION,
				ANIMATION_CONSTANTS.FADE_DISPLAY_DURATION,
				setImage2RightOpacity,
			);
		}, ANIMATION_CONSTANTS.FADE_ANIMATION_INTERVAL);

		return () => clearInterval(interval);
	}, []);

	return {
		image1LeftOpacity,
		image1RightOpacity,
		image2LeftOpacity,
		image2RightOpacity,
	};
};

// ヘルパー関数：画像の透明度を更新（フェードイン）
const updateImageOpacity = (
	currentTime: number,
	startDelay: number,
	transitionDuration: number,
	displayDuration: number,
	setOpacity: (opacity: number) => void,
) => {
	if (
		currentTime >= startDelay &&
		currentTime < startDelay + transitionDuration
	) {
		// フェードイン（0% → 100%）
		const progress = (currentTime - startDelay) / transitionDuration;
		setOpacity(progress);
	} else if (
		currentTime >= startDelay + transitionDuration &&
		currentTime < startDelay + transitionDuration + displayDuration
	) {
		// 表示維持
		setOpacity(1);
	} else if (
		currentTime >= startDelay + transitionDuration + displayDuration &&
		currentTime < startDelay + transitionDuration * 2 + displayDuration
	) {
		// フェードアウト（100% → 0%）
		const progress =
			1 -
			(currentTime - (startDelay + transitionDuration + displayDuration)) /
				transitionDuration;
		setOpacity(progress);
	} else {
		// 非表示
		setOpacity(0);
	}
};

// ヘルパー関数：画像の透明度を更新（フェードアウト）
const updateImageOpacityReverse = (
	currentTime: number,
	startDelay: number,
	transitionDuration: number,
	displayDuration: number,
	setOpacity: (opacity: number) => void,
) => {
	if (currentTime < startDelay) {
		// 最初の期間は100%のまま
		setOpacity(1);
	} else if (
		currentTime >= startDelay &&
		currentTime < startDelay + transitionDuration
	) {
		// フェードアウト（100% → 0%）
		const progress = 1 - (currentTime - startDelay) / transitionDuration;
		setOpacity(progress);
	} else if (
		currentTime >= startDelay + transitionDuration &&
		currentTime < startDelay + transitionDuration + displayDuration
	) {
		// 非表示維持
		setOpacity(0);
	} else if (
		currentTime >= startDelay + transitionDuration + displayDuration &&
		currentTime < startDelay + transitionDuration * 2 + displayDuration
	) {
		// フェードイン（0% → 100%）
		const progress =
			(currentTime - (startDelay + transitionDuration + displayDuration)) /
			transitionDuration;
		setOpacity(progress);
	}
};

// アニメーション画像グリッドコンポーネント
interface AnimatedImageGridProps {
	image1SlideIn: boolean;
	image2SlideIn: boolean;
	slideInOpacity: number;
	image1LeftOpacity: number;
	image1RightOpacity: number;
	image2LeftOpacity: number;
	image2RightOpacity: number;
}

const AnimatedImageGrid: React.FC<AnimatedImageGridProps> = ({
	image1SlideIn,
	image2SlideIn,
	slideInOpacity,
	image1LeftOpacity,
	image1RightOpacity,
	image2LeftOpacity,
	image2RightOpacity,
}) => {
	return (
		<div className="fixed -top-12 right-150 z-50">
			{/* 右上の画像1（上段、右側） - 75%位置 */}
			<div
				className="absolute top-32 right-0 transition-all ease-out"
				style={{
					transitionDuration: `${ANIMATION_CONSTANTS.SLIDE_IN_DURATION}ms`,
					transform: image1SlideIn ? "translateY(0)" : "translateY(5%)",
					opacity: slideInOpacity,
				}}
			>
				<div
					className="overflow-hidden shadow-2xl border border-white/20"
					style={{
						width: "300px",
						height: "720px",
						boxShadow:
							"0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
					}}
				>
					{/* 画像1の右側（75%位置） */}
					<img
						src="/images/home/main/pursuit-blog_home.jpg"
						alt="画像1右側"
						className="object-cover absolute inset-0 w-full h-full"
						style={{
							objectPosition: IMAGE_POSITIONS.IMAGE1_RIGHT,
							opacity: image1RightOpacity,
							transition: "opacity 0.1s ease-in-out",
						}}
					/>
					{/* 画像1の左側（65%位置） */}
					<img
						src="/images/home/main/pursuit-blog_home.jpg"
						alt="画像1左側"
						className="object-cover absolute inset-0 w-full h-full"
						style={{
							objectPosition: IMAGE_POSITIONS.IMAGE1_LEFT,
							opacity: image1LeftOpacity,
							transition: "opacity 0.1s ease-in-out",
						}}
					/>
				</div>
			</div>

			{/* 右上の画像2（下段、左側） - 100%位置 */}
			<div
				className="absolute top-0 left-20 transition-all ease-out"
				style={{
					transitionDuration: `${ANIMATION_CONSTANTS.SLIDE_IN_DURATION}ms`,
					transform: image2SlideIn ? "translateY(0)" : "translateY(-5%)",
					opacity: slideInOpacity,
				}}
			>
				<div
					className="overflow-hidden shadow-2xl border border-white/20"
					style={{
						width: "400px",
						height: "720px",
						boxShadow:
							"0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
					}}
				>
					{/* 画像2の右側（100%位置） */}
					<img
						src="/images/home/main/pursuit-blog_home.jpg"
						alt="画像2右側"
						className="object-cover absolute inset-0 w-full h-full"
						style={{
							objectPosition: IMAGE_POSITIONS.IMAGE2_RIGHT,
							opacity: image2RightOpacity,
							transition: "opacity 0.1s ease-in-out",
						}}
					/>
					{/* 画像2の左側（90%位置） */}
					<img
						src="/images/home/main/pursuit-blog_home.jpg"
						alt="画像2左側"
						className="object-cover absolute inset-0 w-full h-full"
						style={{
							objectPosition: IMAGE_POSITIONS.IMAGE2_LEFT,
							opacity: image2LeftOpacity,
							transition: "opacity 0.1s ease-in-out",
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default function Home() {
	const router = useRouter();
	const [latestArticles, setLatestArticles] = useState<Article[]>([]);

	// カスタムフックを使用
	const { image1SlideIn, image2SlideIn, slideInOpacity } =
		useSlideInAnimation();
	const {
		image1LeftOpacity,
		image1RightOpacity,
		image2LeftOpacity,
		image2RightOpacity,
	} = useFadeAnimation();

	useEffect(() => {
		// 最新記事を取得
		const fetchLatestArticles = async () => {
			try {
				const response = await fetch("/latest-articles.json");
				if (response.ok) {
					const articles = await response.json();
					setLatestArticles(articles);
				}
			} catch (error) {
				console.error("Failed to fetch latest articles:", error);
			}
		};

		fetchLatestArticles();
	}, []);

	return (
		<div className="min-h-screen text-foreground">
			<Navbar />

			{/* メインセクション：仮置き矩形図形とその中に最新記事 */}
			<main
				className="w-full px-4"
				style={{ paddingTop: "8vh", paddingBottom: "4vh" }}
			>
				<div className="w-full">
					{/* メインの仮置き矩形図形とその中に最新記事 */}
					<SlideIn delay={300} duration={800} autoSlide={true}>
						<div className="relative w-full">
							{/* メインの仮置き矩形図形 */}
							<div className="relative top-15 overflow-hidden shadow-2xl mx-4">
								{/* アスペクト比を固定した横長の長方形 - 参考画像サイズに近い比率 */}
								<div
									className="relative w-full"
									style={{
										height: "600px",
									}}
								>
									{/* 背景画像 */}
									<div className="absolute inset-0">
										<img
											src="/images/home/main/pursuit-blog_home.jpg"
											alt="背景画像"
											className="object-cover w-full h-full"
										/>
										{/* 影ぼかしオーバーレイ */}
										<div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
									</div>

									{/* 左下に文字を配置 */}
									<div className="absolute bottom-12 left-12 z-10 max-w-md">
										<div className="space-y-6">
											<p className="text-white/95 text-xl font-light leading-relaxed">
												技術的な可能性を追求し、刺激的な新発見を記録する日々。
											</p>
											<p className="text-white/90 text-lg font-light leading-relaxed">
												AWSの技術的課題とクラウドインフラ開発に幅広く取り組んでいます。
											</p>
											<p className="text-white/90 text-lg font-light leading-relaxed">
												人生の教訓、日々の気づき、技術的発見を記録として残しています。
											</p>
											<p className="text-white/90 text-lg font-light leading-relaxed">
												興味、経験、学んだことを多くの人と共有したいと考えています。
											</p>
											<p className="text-white/95 text-xl font-light leading-relaxed">
												一緒に技術の世界を探求し、新しい発見を楽しみましょう！
											</p>
										</div>
									</div>

									{/* グラデーションオーバーレイ */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
								</div>
							</div>

							{/* 独立した4枚の画像を右上に階段状で配置 */}
							<div className="fixed -top-8 right-150 z-50">
								{/* 右上の画像1（上段、右側） - 75%位置 */}
								<div
									className="absolute top-44 right-0 transition-all duration-[2000ms] ease-out"
									style={{
										transform: image1SlideIn
											? "translateY(0)"
											: "translateY(5%)",
										opacity: slideInOpacity,
									}}
								>
									<div
										className="overflow-hidden shadow-2xl border border-white/20"
										style={{
											width: "300px",
											height: "600px",
											boxShadow:
												"0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
										}}
									>
										{/* 画像1の左側（left-1.png） */}
										<img
											src="/images/home/main/left-1.png"
											alt="画像1左側"
											className="object-cover absolute inset-0 w-full h-full"
											style={{
												opacity: image1LeftOpacity,
												transition: "opacity 0.1s ease-in-out",
											}}
										/>
										{/* 画像1の右側（left-2.png） */}
										<img
											src="/images/home/main/left-2.png"
											alt="画像1右側"
											className="object-cover absolute inset-0 w-full h-full"
											style={{
												opacity: image1RightOpacity,
												transition: "opacity 0.1s ease-in-out",
											}}
										/>
									</div>
								</div>

								{/* 右上の画像2（下段、左側） - 100%位置 */}
								<div
									className="absolute top-0 left-20 transition-all duration-[2000ms] ease-out"
									style={{
										transform: image2SlideIn
											? "translateY(0)"
											: "translateY(-5%)",
										opacity: slideInOpacity,
									}}
								>
									<div
										className="overflow-hidden shadow-2xl border border-white/20"
										style={{
											width: "300px",
											height: "600px",
											boxShadow:
												"0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
										}}
									>
										{/* 画像2の左側（right-1.png） */}
										<img
											src="/images/home/main/right-1.png"
											alt="画像2左側"
											className="object-cover absolute inset-0 w-full h-full"
											style={{
												opacity: image2LeftOpacity,
												transition: "opacity 0.1s ease-in-out",
											}}
										/>
										{/* 画像2の右側（right-2.png） */}
										<img
											src="/images/home/main/right-2.png"
											alt="画像2右側"
											className="object-cover absolute inset-0 w-full h-full"
											style={{
												opacity: image2RightOpacity,
												transition: "opacity 0.1s ease-in-out",
											}}
										/>
									</div>
								</div>
							</div>

							{/* 最新記事の枠を矩形図形の下に配置 */}
							<div className="mt-80 mx-4">
								<div className="max-w-6xl mx-auto">
									{/* セクション全体を囲むコンテナ */}
									<SlideIn delay={800} duration={1000} autoSlide={true}>
										<div className="relative">
											{/* Latest Articlesタイトルを横線で挟む */}
											<div className="text-center mb-16">
												<div className="w-full h-0.5 bg-[#8B4513] mb-8" />
												<h2
													className="font-bold text-[#8B4513] mb-8 relative z-10"
													style={{
														fontSize: "clamp(2.5rem, 8vw, 5rem)",
														lineHeight: "0.9",
														letterSpacing: "-0.02em",
														containIntrinsicSize: "0 4rem",
														contentVisibility: "auto",
													}}
												>
													Latest Articles
												</h2>
												<div className="w-full h-0.5 bg-[#8B4513]" />
											</div>

											<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
												{/* Portfolio記事の列 */}
												<SlideIn delay={1000} duration={800} autoSlide={true}>
													<div className="space-y-8">
														{/* カテゴリータイトルの改善 */}
														<div className="text-center mb-8">
															<h3 className="font-bold text-xl purple-accent mb-2">
																Portfolio
															</h3>
															<div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full" />
														</div>

														<div className="space-y-6">
															{latestArticles
																.filter(
																	(article) => article.category === "portfolio",
																)
																.slice(0, 3)
																.map((article, index) => (
																	<SlideIn
																		key={article.slug}
																		delay={1200 + index * 200}
																		duration={600}
																		autoSlide={true}
																	>
																		<button
																			type="button"
																			className="glass-interactive rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl w-full text-left group"
																			onClick={() =>
																				router.push(
																					`/${article.category}/${article.slug}`,
																				)
																			}
																			aria-label={`記事「${article.title}」を開く`}
																		>
																			<div className="flex flex-col sm:flex-row h-auto sm:h-[160px]">
																				{/* サムネイル画像 - モバイルでは上部に配置 */}
																				<div className="w-full sm:w-52 h-48 sm:h-[160px] overflow-hidden relative flex-shrink-0">
																					{/* Portfolio記事のサムネイル画像 */}
																					{article.thumbnail ? (
																						<img
																							src={article.thumbnail}
																							alt={article.title}
																							className="object-cover transition-transform duration-300 group-hover:scale-110 w-full h-full"
																						/>
																					) : (
																						<div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-200">
																							<span className="text-sm font-medium">
																								No Image
																							</span>
																						</div>
																					)}
																				</div>

																				{/* 記事情報 - モバイルでは下部に配置 */}
																				<div className="flex-1 p-4 sm:p-4">
																					<h3 className="text-lg sm:text-base font-medium text-gray-900 line-clamp-2 mb-3 sm:mb-2 hover:text-primary transition-colors duration-300">
																						{article.title}
																					</h3>

																					{/* 日付 */}
																					<div className="flex items-center gap-2 text-sm sm:text-xs text-gray-600 mb-4 sm:mb-3">
																						<svg
																							className="w-4 h-4 sm:w-3 sm:h-3"
																							fill="none"
																							stroke="currentColor"
																							viewBox="0 0 24 24"
																							aria-hidden="true"
																						>
																							<path
																								strokeLinecap="round"
																								strokeLinejoin="round"
																								strokeWidth="2"
																								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
																							/>
																						</svg>
																						<time dateTime={article.date}>
																							{new Date(
																								article.date,
																							).toLocaleDateString("ja-JP", {
																								year: "numeric",
																								month: "long",
																								day: "numeric",
																							})}
																						</time>
																					</div>

																					{/* タグ */}
																					{article.tags &&
																						article.tags.length > 0 && (
																							<div className="flex flex-wrap gap-2 sm:gap-1">
																								{article.tags
																									.slice(0, 3)
																									.map((tag) => (
																										<span
																											key={tag}
																											className="px-3 py-1.5 sm:px-2 sm:py-1 bg-purple-500/20 text-purple-700 text-sm sm:text-xs rounded-full hover:bg-purple-500/30 transition-colors duration-200"
																										>
																											{tag}
																										</span>
																									))}
																								{article.tags.length > 3 && (
																									<span className="px-3 py-1.5 sm:px-2 sm:py-1 bg-gray-500/20 text-gray-700 text-sm sm:text-xs rounded-full">
																										...
																									</span>
																								)}
																							</div>
																						)}
																				</div>
																			</div>
																		</button>
																	</SlideIn>
																))}
														</div>
													</div>
												</SlideIn>

												{/* Life記事の列 */}
												<SlideIn delay={1100} duration={800} autoSlide={true}>
													<div className="space-y-8">
														{/* カテゴリータイトルの改善 */}
														<div className="text-center mb-8">
															<h3 className="font-bold text-xl purple-accent mb-2">
																Life
															</h3>
															<div className="w-16 h-0.5 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full" />
														</div>

														<div className="space-y-6">
															{latestArticles
																.filter(
																	(article) => article.category === "life",
																)
																.slice(0, 3)
																.map((article, index) => (
																	<SlideIn
																		key={article.slug}
																		delay={1300 + index * 200}
																		duration={600}
																		autoSlide={true}
																	>
																		<button
																			type="button"
																			className="glass-interactive rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl w-full text-left group"
																			onClick={() =>
																				router.push(
																					`/${article.category}/${article.slug}`,
																				)
																			}
																			aria-label={`記事「${article.title}」を開く`}
																		>
																			<div className="flex h-[160px]">
																				{/* 左側：サムネイル画像 */}
																				<div className="w-52 h-[160px] overflow-hidden relative flex-shrink-0">
																					{/* Life記事のサムネイル画像 */}
																					{article.thumbnail ? (
																						<img
																							src={article.thumbnail}
																							alt={article.title}
																							className="object-cover transition-transform duration-300 group-hover:scale-110 w-full h-full"
																						/>
																					) : (
																						<div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-200">
																							<span className="text-sm font-medium">
																								No Image
																							</span>
																						</div>
																					)}
																				</div>

																				{/* 右側：記事情報 */}
																				<div className="flex-1 p-4">
																					<h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2 hover:text-primary transition-colors duration-300">
																						{article.title}
																					</h3>

																					{/* 日付 */}
																					<div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
																						<svg
																							className="w-3 h-3"
																							fill="none"
																							stroke="currentColor"
																							viewBox="0 0 24 24"
																							aria-hidden="true"
																						>
																							<path
																								strokeLinecap="round"
																								strokeLinejoin="round"
																								strokeWidth="2"
																								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
																							/>
																						</svg>
																						<time dateTime={article.date}>
																							{new Date(
																								article.date,
																							).toLocaleDateString("ja-JP", {
																								year: "numeric",
																								month: "long",
																								day: "numeric",
																							})}
																						</time>
																					</div>

																					{/* タグ */}
																					{article.tags &&
																						article.tags.length > 0 && (
																							<div className="flex flex-wrap gap-1">
																								{article.tags
																									.slice(0, 3)
																									.map((tag) => (
																										<span
																											key={tag}
																											className="px-2 py-1 bg-green-500/20 text-green-700 text-xs rounded-full hover:bg-purple-500/30 transition-colors duration-200"
																										>
																											{tag}
																										</span>
																									))}
																								{article.tags.length > 3 && (
																									<span className="px-2 py-1 bg-gray-500/20 text-gray-700 text-xs rounded-full">
																										...
																									</span>
																								)}
																							</div>
																						)}
																				</div>
																			</div>
																		</button>
																	</SlideIn>
																))}
														</div>
													</div>
												</SlideIn>
											</div>
										</div>
									</SlideIn>
								</div>
							</div>
						</div>
					</SlideIn>
				</div>
			</main>
		</div>
	);
}
