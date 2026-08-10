"use client";

import { useEffect, useRef } from "react";

interface CanvasBackgroundProps {
	enabled?: boolean;
}

interface AnimationItem {
	x: number;
	y: number;
	blur: number;
	radius: number;
	initialXDirection: number;
	initialYDirection: number;
	initialBlurDirection: number;
	colorOne: string;
	colorTwo: string;
	gradient: [number, number, number, number];
}

export function CanvasBackground({ enabled = true }: CanvasBackgroundProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!enabled || !canvasRef.current) return;

		const canvas = canvasRef.current;
		let ctx = canvas.getContext("2d");
		if (!ctx) return;

		// ユーティリティ関数
		const rand = (min: number, max: number): number => {
			return Math.random() * (max - min) + min;
		};

		// Canvas サイズを設定
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.globalCompositeOperation = "lighter";
			}
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// 設定値
		const backgroundColors = ["#000", "#000"];
		const colors = [
			["#001133", "#002244"],
			["#001122", "#002233"],
			["#110022", "#220033"],
		];
		let count = 70;
		const blur = [12, 70];
		const radius = [1, 120];

		// 初期化
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "lighter";

		// 背景グラデーション
		const grd = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
		grd.addColorStop(0, backgroundColors[0]);
		grd.addColorStop(1, backgroundColors[1]);
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// アニメーション要素の配列
		const items: AnimationItem[] = [];

		// アニメーション要素を生成
		while (count--) {
			const thisRadius = rand(radius[0], radius[1]);
			const thisBlur = rand(blur[0], blur[1]);
			const x = rand(-100, canvas.width + 100);
			const y = rand(-100, canvas.height + 100);
			const colorIndex = Math.floor(rand(0, 299) / 100);
			const colorOne = colors[colorIndex][0];
			const colorTwo = colors[colorIndex][1];

			ctx.beginPath();
			ctx.filter = `blur(${thisBlur}px)`;
			const itemGrd = ctx.createLinearGradient(
				x - thisRadius / 2,
				y - thisRadius / 2,
				x + thisRadius,
				y + thisRadius,
			);

			itemGrd.addColorStop(0, colorOne);
			itemGrd.addColorStop(1, colorTwo);
			ctx.fillStyle = itemGrd;
			ctx.fill();
			ctx.arc(x, y, thisRadius, 0, Math.PI * 2);
			ctx.closePath();

			const directionX = Math.round(rand(-99, 99) / 100);
			const directionY = Math.round(rand(-99, 99) / 100);

			items.push({
				x: x,
				y: y,
				blur: thisBlur,
				radius: thisRadius,
				initialXDirection: directionX,
				initialYDirection: directionY,
				initialBlurDirection: directionX,
				colorOne: colorOne,
				colorTwo: colorTwo,
				gradient: [
					x - thisRadius / 2,
					y - thisRadius / 2,
					x + thisRadius,
					y + thisRadius,
				],
			});
		}

		// アニメーション関数
		const changeCanvas = () => {
			if (!ctx || !canvas) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const adjX = 2;
			const adjY = 2;
			const adjBlur = 1;

			for (const item of items) {
				if (!ctx) return; // 各アイテム処理でもnullチェック

				// 境界チェックと方向転換
				if (
					(item.x + item.initialXDirection * adjX >= canvas.width &&
						item.initialXDirection !== 0) ||
					(item.x + item.initialXDirection * adjX <= 0 &&
						item.initialXDirection !== 0)
				) {
					item.initialXDirection = item.initialXDirection * -1;
				}
				if (
					(item.y + item.initialYDirection * adjY >= canvas.height &&
						item.initialYDirection !== 0) ||
					(item.y + item.initialYDirection * adjY <= 0 &&
						item.initialYDirection !== 0)
				) {
					item.initialYDirection = item.initialYDirection * -1;
				}

				if (
					(item.blur + item.initialBlurDirection * adjBlur >= radius[1] &&
						item.initialBlurDirection !== 0) ||
					(item.blur + item.initialBlurDirection * adjBlur <= radius[0] &&
						item.initialBlurDirection !== 0)
				) {
					item.initialBlurDirection *= -1;
				}

				// 位置とブラーを更新
				item.x += item.initialXDirection * adjX;
				item.y += item.initialYDirection * adjY;
				item.blur += item.initialBlurDirection * adjBlur;

				// 描画
				ctx.beginPath();
				ctx.filter = `blur(${item.blur}px)`;
				const itemGrd = ctx.createLinearGradient(
					item.gradient[0],
					item.gradient[1],
					item.gradient[2],
					item.gradient[3],
				);
				itemGrd.addColorStop(0, item.colorOne);
				itemGrd.addColorStop(1, item.colorTwo);
				ctx.fillStyle = itemGrd;
				ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();
			}

			animationId = requestAnimationFrame(changeCanvas);
		};

		let animationId = requestAnimationFrame(changeCanvas);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [enabled]);

	if (!enabled) {
		return null;
	}

	return <canvas ref={canvasRef} />;
}
