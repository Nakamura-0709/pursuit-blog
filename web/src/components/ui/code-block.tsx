"use client";

import { useEffect, useState, useCallback } from "react";
import { createHighlighter, type Highlighter } from "shiki";

interface CodeBlockProps {
	code: string;
	language: string;
	theme?: string;
	showLineNumbers?: boolean;
	className?: string;
}

export function CodeBlock({
	code,
	language,
	theme = "material-theme-darker",
	showLineNumbers = true,
	className = "",
}: CodeBlockProps) {
	const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
	const [highlightedCode, setHighlightedCode] = useState<string>("");

	// 言語マッピング（env → bash）
	const getMappedLanguage = useCallback((lang: string) => {
		const languageMap: Record<string, string> = {
			env: "bash",
			shell: "bash",
			sh: "bash",
			zsh: "bash",
			"shell-session": "bash",
		};
		return languageMap[lang] || lang;
	}, []);

	useEffect(() => {
		const initHighlighter = async () => {
			try {
				const mappedLanguage = getMappedLanguage(language);
				const hl = await createHighlighter({
					themes: [theme],
					langs: [mappedLanguage],
				});
				setHighlighter(hl);
			} catch (error) {
				console.error("Failed to initialize highlighter:", error);
				// フォールバックとしてプレーンテキストで表示
				setHighlightedCode(`<pre><code>${code}</code></pre>`);
			}
		};

		initHighlighter();
	}, [theme, language, getMappedLanguage, code]);

	useEffect(() => {
		if (highlighter && code) {
			try {
				const mappedLanguage = getMappedLanguage(language);
				const html = highlighter.codeToHtml(code, {
					lang: mappedLanguage,
					theme: theme,
					transformers: showLineNumbers
						? [
								{
									pre(node) {
										node.properties.style = `${node.properties.style || ""}; counter-reset: line;`;
									},
									line(node, line) {
										node.properties.style = `${node.properties.style || ""}; counter-increment: line;`;
										node.children.unshift({
											type: "element",
											tagName: "span",
											properties: {
												class: "line-number",
												style:
													"color: #666; margin-right: 1rem; user-select: none;",
											},
											children: [],
										});
									},
								},
							]
						: [],
				});
				setHighlightedCode(html);
			} catch (error) {
				console.error("Failed to highlight code:", error);
				setHighlightedCode(`<pre><code>${code}</code></pre>`);
			}
		}
	}, [highlighter, code, language, theme, showLineNumbers, getMappedLanguage]);

	if (!highlightedCode) {
		return (
			<div
				className={`bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg border border-gray-700 ${className}`}
			>
				<pre className="text-xs sm:text-sm overflow-x-auto">
					<code>{code}</code>
				</pre>
			</div>
		);
	}

	return (
		<div
			className={`bg-gray-900 text-gray-100 rounded-lg overflow-hidden border border-gray-700 ${className}`}
			style={{
				fontSize: "12px",
				lineHeight: "1.5",
			}}
		>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: シンタックスハイライトのため安全なHTMLを使用 */}
			<div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
		</div>
	);
}
