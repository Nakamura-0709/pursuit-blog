"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CodeBlock } from "./code-block";
import Mermaid from "../../../components/Mermaid";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
	content,
	className,
}: MarkdownRendererProps) {
	return (
		<div className={cn("prose max-w-none", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={{
					// コードブロック
					code({
						className,
						children,
						...props
					}: React.ComponentPropsWithoutRef<"code">) {
						const match = /language-(\w+)/.exec(className || "");
						const language = match ? match[1] : "text";
						const isInline = !match;

						if (!isInline && match) {
							// Mermaidコードブロックの処理
							if (language === "mermaid") {
								return (
									<Mermaid
										chart={String(children).replace(/\n$/, "")}
										className="my-4"
									/>
								);
							}

							return (
								<CodeBlock
									code={String(children).replace(/\n$/, "")}
									language={language}
									className="my-4"
								/>
							);
						}

						return (
							<code
								className="bg-purple-900/30 text-purple-700 px-1.5 py-0.5 rounded text-sm font-mono border border-purple-200/60"
								{...props}
							>
								{children}
							</code>
						);
					},

					// preタグはCodeBlockコンポーネントで処理されるため、ここでは何もしない
					pre: ({ children }) => <>{children}</>,

					// 見出し
					h1: ({ children }) => (
						<h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 mt-14 sm:mt-16 purple-accent border-b border-primary/30 pb-3">
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="text-2xl sm:text-3xl font-semibold mb-5 sm:mb-6 mt-12 sm:mt-14 purple-accent border-b-2 border-primary/40 pb-2">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 mt-10 sm:mt-12 purple-accent">
							{children}
						</h3>
					),
					h4: ({ children }) => (
						<h4 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 mt-8 sm:mt-10 purple-accent">
							{children}
						</h4>
					),
					h5: ({ children }) => (
						<h5 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 mt-7 sm:mt-9 purple-accent">
							{children}
						</h5>
					),

					// 段落
					p: ({ children }) => (
						<p className="mb-5 sm:mb-6 leading-relaxed text-foreground text-sm sm:text-base">
							{children}
						</p>
					),

					// リスト
					ul: ({ children }) => (
						<ul className="mb-5 sm:mb-6 ml-4 sm:ml-6 space-y-2 sm:space-y-3 list-disc text-foreground text-sm sm:text-base">
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol className="mb-5 sm:mb-6 ml-4 sm:ml-6 space-y-2 sm:space-y-3 list-decimal text-foreground text-sm sm:text-base">
							{children}
						</ol>
					),

					// リンク
					a: ({ href, children }) => (
						<a
							href={href}
							className="text-blue-600 hover:text-blue-800 underline transition-colors text-sm sm:text-base"
							target="_blank"
							rel="noopener noreferrer"
						>
							{children}
						</a>
					),

					// 引用
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-primary pl-3 sm:pl-4 my-3 sm:my-4 italic text-muted-foreground bg-primary/10 py-2 rounded-r text-sm sm:text-base">
							{children}
						</blockquote>
					),

					// テーブル
					table: ({ children }) => (
						<div className="overflow-x-auto my-3 sm:my-4">
							<table className="min-w-full bg-white/80 rounded-lg overflow-hidden border border-gray-200/60 text-sm sm:text-base">
								{children}
							</table>
						</div>
					),
					thead: ({ children }) => (
						<thead className="bg-primary/20">{children}</thead>
					),
					th: ({ children }) => (
						<th className="px-2 sm:px-4 py-2 text-left font-semibold text-foreground border-b border-primary/30">
							{children}
						</th>
					),
					td: ({ children }) => (
						<td className="px-2 sm:px-4 py-2 text-foreground border-b border-primary/20">
							{children}
						</td>
					),

					// 水平線
					hr: () => <hr className="my-6 sm:my-8 border-primary/30" />,

					// 画像
					img: ({ src, alt }) => (
						<img
							src={src}
							alt={alt}
							className="shadow-lg max-w-full h-auto my-3 sm:my-4 border border-gray-300 bg-white p-1"
						/>
					),

					// 強調
					strong: ({ children }) => (
						<strong className="font-bold text-foreground text-sm sm:text-base">
							{children}
						</strong>
					),

					// 斜体
					em: ({ children }) => (
						<em className="italic text-foreground text-sm sm:text-base">
							{children}
						</em>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
});
