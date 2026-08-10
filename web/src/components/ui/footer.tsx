import Image from "next/image";

export function Footer() {
	return (
		<footer className="bg-white border-t border-border mt-20">
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col lg:flex-row gap-20">
						{/* プロフィール写真 */}
						<div className="flex flex-col items-center lg:items-start w-fit">
							<div className="relative w-32 h-32 mb-4">
								<img
									src="/images/home/profile/profile.jpeg"
									alt="中村 光良"
									className="rounded-full object-cover border-2 border-primary/20 w-full h-full"
								/>
							</div>
							<div className="text-center lg:text-left">
								<h3 className="text-xl font-semibold mb-1 purple-accent">
									中村 光良
								</h3>
								<p className="text-sm text-muted-foreground">
									Mitsuyoshi Nakamura
								</p>
							</div>
						</div>

						{/* 自己紹介と連絡先 */}
						<div className="flex-1">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* 自己紹介（左側） */}
								<div className="lg:border-r lg:border-border lg:pr-12">
									<h4 className="text-lg font-semibold mb-4 purple-accent">
										About Me
									</h4>
									<div className="space-y-4 text-muted-foreground leading-relaxed">
										<p>
											DevOps エンジニアとして AWS
											を活用した複数プロジェクトの要件定義から設計・構築を経験。
											現在は SRE をより深掘りできるように勉強中。
										</p>
										<p>
											直近では BIM モデルや生成系 AI
											のプロジェクトに従事し、お客様のドメインに寄り添った設計を実施。
										</p>
									</div>
								</div>

								{/* 連絡先（右側） */}
								<div className="lg:pl-6">
									<h4 className="text-lg font-semibold mb-6 purple-accent">
										Get in touch
									</h4>
									<div className="space-y-4">
										<div className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
											<div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
												<span className="text-primary">📧</span>
											</div>
											<div>
												<p className="font-medium">メール</p>
												<p className="text-muted-foreground">
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
											<div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
												<svg
													className="w-5 h-5 text-primary"
													fill="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
													role="img"
													aria-label="GitHub"
												>
													<title>GitHub</title>
													<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
												</svg>
											</div>
											<div>
												<p className="font-medium group-hover:text-primary transition-colors">
													GitHub
												</p>
												<p className="text-muted-foreground">
													github.com/Nakamura-0709
												</p>
											</div>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
