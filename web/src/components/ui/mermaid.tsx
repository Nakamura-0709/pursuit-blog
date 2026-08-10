"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
	chart: string;
	className?: string;
}

export default function Mermaid({ chart, className }: MermaidProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const initializeMermaid = async () => {
			try {
				// Mermaidの初期化（一度だけ実行）
				mermaid.initialize({
					startOnLoad: false,
					theme: "default",
					securityLevel: "loose",
					fontFamily: "monospace",
					// 背景色を白に設定
					themeVariables: {
						background: "#ffffff",
						primaryColor: "#4f46e5",
						primaryTextColor: "#1f2937",
						primaryBorderColor: "#4f46e5",
						lineColor: "#374151",
						secondaryColor: "#f3f4f6",
						tertiaryColor: "#f9fafb",
						errorBkgColor: "#fee2e2",
						errorTextColor: "#dc2626",
						successColor: "#10b981",
						successTextColor: "#065f46",
						warningColor: "#f59e0b",
						warningTextColor: "#92400e",
						infoColor: "#3b82f6",
						infoTextColor: "#1e40af",
					},
				});

				if (ref.current && isMounted) {
					setIsLoading(true);
					setError(null);

					// ユニークなIDを生成
					const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

					const { svg } = await mermaid.render(id, chart);

					if (ref.current && isMounted) {
						ref.current.innerHTML = svg;
						setIsLoading(false);
					}
				}
			} catch (err) {
				if (isMounted) {
					console.error("Mermaid rendering error:", err);
					setError(
						err instanceof Error ? err.message : "Mermaid rendering failed",
					);
					setIsLoading(false);
				}
			}
		};

		initializeMermaid();

		return () => {
			isMounted = false;
		};
	}, [chart]);

	if (error) {
		return (
			<div
				className={`p-4 border border-red-500/30 rounded-lg bg-red-900/20 ${className || ""}`}
			>
				<p className="text-red-400 text-sm">
					Mermaid図の表示に失敗しました: {error}
				</p>
				<details className="mt-2">
					<summary className="text-red-300 text-xs cursor-pointer">
						コードを表示
					</summary>
					<pre className="mt-2 text-xs text-red-200 bg-red-900/30 p-2 rounded overflow-x-auto">
						{chart}
					</pre>
				</details>
			</div>
		);
	}

	return (
		<div className={`relative ${className || ""}`}>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
					<div className="text-purple-400 text-sm">図を生成中...</div>
				</div>
			)}
			<div
				ref={ref}
				className="flex justify-center bg-white rounded-lg p-4 shadow-lg"
			/>
		</div>
	);
}
