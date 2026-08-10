"use client";

import { Navbar } from "@/components/ui/navbar";
import { SlideIn } from "@/components/ui/slide-in";
import { RippleCard } from "@/components/ui/ripple-card";
import { useState } from "react";

const techStack = [
	{ name: "AWS", icon: "☁️", color: "bg-yellow-400" },
	{ name: "Git", icon: "🔧", color: "bg-orange-700" },
	{ name: "JavaScript", icon: "⚡", color: "bg-yellow-500" },
	{ name: "Python", icon: "🐍", color: "bg-blue-400" },
	{ name: "Docker", icon: "🐳", color: "bg-blue-600" },
	{ name: "Next.js", icon: "⏭️", color: "bg-gray-800" },
	{ name: "Node.js", icon: "🟢", color: "bg-green-500" },
	{ name: "SQL", icon: "🗄️", color: "bg-indigo-700" },
];

const certificates = [
	{
		name: "AWS 認定ソリューションアーキテクト – プロフェッショナル",
		icon: "🟣",
		color: "bg-purple-700",
	},
	{ name: "LPIC level 1", icon: "🐧", color: "bg-gray-600" },
	{
		name: "AWS 認定ソリューションアーキテクト – プラクティショナー",
		icon: "🟢",
		color: "bg-green-600",
	},
	{
		name: "AWS 認定ソリューションアーキテクト – アソシエイト",
		icon: "🔵",
		color: "bg-blue-600",
	},
	{ name: "CCNA", icon: "🌐", color: "bg-cyan-700" },
];

export default function About() {
	const [activeTab, setActiveTab] = useState<"certificates" | "techstack">(
		"techstack",
	);

	const getCurrentData = () => {
		switch (activeTab) {
			case "certificates":
				return certificates;
			case "techstack":
				return techStack;
			default:
				return techStack;
		}
	};

	const getTabTitle = () => {
		switch (activeTab) {
			case "certificates":
				return "Certificates";
			case "techstack":
				return "Tech Stack";
			default:
				return "Tech Stack";
		}
	};

	// 波紋エフェクトを作成する関数
	const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
		const card = e.currentTarget;
		const rect = card.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height) * 1.5;
		const x = e.clientX - rect.left - size / 2;
		const y = e.clientY - rect.top - size / 2;

		const ripple = document.createElement("div");
		ripple.style.position = "absolute";
		ripple.style.borderRadius = "50%";
		ripple.style.background = "rgba(138, 43, 226, 0.4)";
		ripple.style.width = `${size}px`;
		ripple.style.height = `${size}px`;
		ripple.style.left = `${x}px`;
		ripple.style.top = `${y}px`;
		ripple.style.transform = "scale(0)";
		ripple.style.opacity = "1";
		ripple.style.pointerEvents = "none";
		ripple.style.zIndex = "999";
		ripple.style.transition = "all 0.6s ease-out";

		card.appendChild(ripple);

		setTimeout(() => {
			ripple.style.transform = "scale(4)";
			ripple.style.opacity = "0";
		}, 10);

		setTimeout(() => {
			if (ripple.parentNode) {
				ripple.parentNode.removeChild(ripple);
			}
		}, 600);
	};

	return (
		<div className="min-h-screen text-foreground">
			<Navbar />

			{/* ヒーローセクション */}
			<main className="container mx-auto px-4 pt-32 pb-16">
				<div className="max-w-6xl mx-auto">
					<SlideIn delay={100} duration={800} autoSlide={true}>
						<h1
							className="font-bold purple-accent mb-16 text-center"
							style={{
								fontSize: "clamp(2.5rem, 8vw, 5rem)",
								lineHeight: "0.9",
								letterSpacing: "-0.02em",
							}}
						>
							About Me
						</h1>
					</SlideIn>

					{/* タブナビゲーション */}
					<SlideIn delay={300} duration={800} autoSlide={true}>
						<div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-6">
							<RippleCard
								className={`px-8 sm:px-20 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 w-full sm:min-w-[240px] text-center flex flex-col items-center gap-1 ${
									activeTab === "certificates"
										? "bg-primary text-primary-foreground shadow-lg"
										: "text-muted-foreground hover:text-foreground hover:bg-white/10"
								}`}
								onClick={() => setActiveTab("certificates")}
							>
								<span>Certificates</span>
							</RippleCard>
							<RippleCard
								className={`px-8 sm:px-20 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 w-full sm:min-w-[240px] text-center flex flex-col items-center gap-1 ${
									activeTab === "techstack"
										? "bg-primary text-primary-foreground shadow-lg"
										: "text-muted-foreground hover:text-foreground hover:bg-white/10"
								}`}
								onClick={() => setActiveTab("techstack")}
							>
								<span>Tech Stack</span>
							</RippleCard>
						</div>
					</SlideIn>

					{/* コンテンツエリア */}
					<SlideIn delay={500} duration={800} autoSlide={true}>
						<div className="glass-interactive rounded-2xl p-4 sm:p-8 mb-12">
							<h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 purple-accent text-center">
								{getTabTitle()}
							</h2>

							{/* アイコングリッド */}
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
								{getCurrentData().map((item, index) => {
									// 位置に基づいて方向を決定
									const columnIndex = index % 6;
									let direction: "top-right" | "up" | "top-left";
									if (columnIndex === 0) {
										// 左端 - 左下からスライドイン
										direction = "top-right";
									} else if (columnIndex === 5) {
										// 右端 - 右下からスライドイン
										direction = "top-left";
									} else {
										// 中央 - 下からスライドイン
										direction = "up";
									}

									return (
										<SlideIn
											key={item.name}
											delay={600 + index * 50}
											duration={800}
											direction={direction}
											distance={80}
											autoSlide={true}
										>
											<button
												className="bg-card/80 border border-border/50 rounded-2xl p-6 text-center cursor-pointer relative overflow-hidden transition-transform duration-300 hover:scale-105"
												onClick={createRipple}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														// マウスイベントを模擬
														const rect =
															e.currentTarget.getBoundingClientRect();
														const mockEvent = {
															currentTarget: e.currentTarget,
															clientX: rect.left + rect.width / 2,
															clientY: rect.top + rect.height / 2,
														} as React.MouseEvent<HTMLButtonElement>;
														createRipple(mockEvent);
													}
												}}
												type="button"
											>
												<div
													className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto relative z-10`}
												>
													{item.icon}
												</div>
												<h3 className="font-medium text-sm text-center leading-tight relative z-10">
													{item.name}
												</h3>
											</button>
										</SlideIn>
									);
								})}
							</div>
						</div>
					</SlideIn>
				</div>
			</main>
		</div>
	);
}
