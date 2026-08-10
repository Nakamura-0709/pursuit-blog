"use client";

import { Navbar } from "@/components/ui/navbar";
import { SlideIn } from "@/components/ui/slide-in";
import { useState } from "react";

// GitHubアイコンコンポーネント
const GitHubIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
	<svg
		className={className}
		fill="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-label="GitHub"
	>
		<title>GitHub</title>
		<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
	</svg>
);

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus("idle");
		setErrorMessage("");

		try {
			// CloudFront が /api/contact を API Gateway に流すため同一オリジン
			// 環境変数でホストを差し込む必要がない
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok && result.success) {
				setSubmitStatus("success");
				setFormData({ name: "", email: "", subject: "", message: "" });
			} else {
				setSubmitStatus("error");
				// バックエンドのエラーレスポンス形式に合わせる
				if (result.errors) {
					// バリデーションエラーの場合
					const errorMessages = Object.values(result.errors).join(", ");
					setErrorMessage(errorMessages);
				} else {
					setErrorMessage(result.message || "メール送信に失敗しました");
				}
			}
		} catch (error) {
			setSubmitStatus("error");
			setErrorMessage(
				"ネットワークエラーが発生しました。しばらく時間をおいて再度お試しください。",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen text-foreground">
			<Navbar />

			{/* ヒーローセクション */}
			<main className="container mx-auto px-4 pt-32 pb-16">
				<div className="max-w-4xl mx-auto">
					<SlideIn delay={100} duration={800} autoSlide={true}>
						<h1
							className="font-bold purple-accent mb-6 text-center"
							style={{
								fontSize: "clamp(2.5rem, 8vw, 5rem)",
								lineHeight: "0.9",
								letterSpacing: "-0.02em",
							}}
						>
							Get In Touch
						</h1>
						<p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-center">
							お気軽にお声がけください。 ただのご挨拶でも大歓迎です。
						</p>
					</SlideIn>

					<div className="grid grid-cols-1 gap-12">
						{/* お問い合わせフォーム */}
						<SlideIn delay={300} duration={800} autoSlide={true}>
							<div className="glass-interactive rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto">
								<h2 className="text-xl sm:text-2xl font-semibold mb-6 purple-accent">
									Send a Message
								</h2>

								{/* 成功・エラーメッセージ */}
								{submitStatus === "success" && (
									<div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
										<p className="text-green-400 text-sm sm:text-base">
											メッセージを送信しました！ありがとうございます。
										</p>
									</div>
								)}

								{submitStatus === "error" && (
									<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
										<p className="text-red-400 text-sm sm:text-base">
											{errorMessage}
										</p>
									</div>
								)}

								<form
									onSubmit={handleSubmit}
									className="space-y-4 sm:space-y-6"
								>
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium mb-2"
										>
											お名前
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											required
											className="w-full px-3 sm:px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
											placeholder="Name"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium mb-2"
										>
											メールアドレス
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											required
											className="w-full px-3 sm:px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
											placeholder="your.email@example.com"
										/>
									</div>

									<div>
										<label
											htmlFor="subject"
											className="block text-sm font-medium mb-2"
										>
											件名
										</label>
										<input
											type="text"
											id="subject"
											name="subject"
											value={formData.subject}
											onChange={handleInputChange}
											required
											className="w-full px-3 sm:px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
											placeholder="Subject"
										/>
									</div>

									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium mb-2"
										>
											メッセージ
										</label>
										<textarea
											id="message"
											name="message"
											rows={6}
											value={formData.message}
											onChange={handleInputChange}
											required
											className="w-full px-3 sm:px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-base"
											placeholder="ご用件をどうぞ。お気軽にご挨拶もお待ちしています。"
										/>
									</div>

									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-primary-foreground py-3 rounded-lg font-medium transition-colors text-base"
									>
										{isSubmitting ? "送信中..." : "メッセージを送信"}
									</button>
								</form>
							</div>
						</SlideIn>

						{/* 連絡先情報 */}
						<SlideIn delay={500} duration={800} autoSlide={true}>
							<div className="glass-interactive rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto">
								<h2 className="text-xl sm:text-2xl font-semibold mb-6 purple-accent text-center">
									Contact Information
								</h2>
								<div className="grid grid-cols-1 gap-4 sm:gap-6">
									<div className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
										<div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
											<span className="text-primary">📧</span>
										</div>
										<div className="min-w-0">
											<p className="font-medium text-sm sm:text-base">メール</p>
											<p className="text-muted-foreground text-sm sm:text-base break-all">
												mi.nakamura0709@gmail.com
											</p>
										</div>
									</div>

									<a
										href="https://github.com/Nakamura-0709"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors group"
									>
										<div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors flex-shrink-0">
											<GitHubIcon className="w-5 h-5 text-primary" />
										</div>
										<div className="min-w-0">
											<p className="font-medium group-hover:text-primary transition-colors text-sm sm:text-base">
												GitHub
											</p>
											<p className="text-muted-foreground text-sm sm:text-base break-all">
												github.com/Nakamura-0709
											</p>
										</div>
									</a>
								</div>
							</div>
						</SlideIn>
					</div>
				</div>
			</main>
		</div>
	);
}
