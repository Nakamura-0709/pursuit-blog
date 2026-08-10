// featuresディレクトリの画像パスを取得
export function getFeatureImages(): string[] {
	return [
		"/images/home/features/DSC_0451_1.JPG",
		"/images/home/features/DSC_3041.JPG",
		"/images/home/features/IMG20210414145956.jpg",
		"/images/home/features/IMG20210617125813.jpg",
		"/images/home/features/IMG20210707075651.jpg",
		"/images/home/features/IMG20211106053818.jpg",
		"/images/home/features/IMG20230226153834.jpg",
		"/images/home/features/IMG_20240829_140047.jpg",
		"/images/home/features/IMG_20250118_032225.jpg",
		"/images/home/features/IMG_20250416_155731.jpg",
	];
}

// 画像のalt属性用の説明を取得
export function getFeatureImageAlt(index: number): string {
	const descriptions = [
		"自然の中での一枚",
		"風景写真",
		"日常の瞬間",
		"思い出の一コマ",
		"特別な日",
		"心に残る風景",
		"美しい自然",
		"季節の移ろい",
		"大切な時間",
		"素敵な思い出",
	];

	return descriptions[index] || "素敵な写真";
}

// 記事のサムネイル画像パスを取得
export function getArticleThumbnail(category: string, slug: string): string {
	// 記事のサムネイル画像パスを構築
	return `/images/articles/${category}/thumbnails/${slug}`;
}

// 記事のサムネイル画像が存在するかチェック
export function getArticleThumbnailWithFallback(
	category: string,
	slug: string,
): string {
	// 画像が存在しない場合は「no image」を返す
	return "";
}
