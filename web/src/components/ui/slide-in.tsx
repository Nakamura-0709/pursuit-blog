"use client";

import { useEffect, useState, useRef } from "react";

type SlideDirection =
	| "up"
	| "down"
	| "left"
	| "right"
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

interface SlideInProps {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	distance?: number;
	direction?: SlideDirection;
	className?: string;
	autoSlide?: boolean;
	observeIntersection?: boolean;
}

export function SlideIn({
	children,
	delay = 0,
	duration = 800,
	distance = 50,
	direction = "up",
	className = "",
	autoSlide = false,
	observeIntersection = true,
}: SlideInProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [hasAnimated, setHasAnimated] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (autoSlide) {
			const timer = setTimeout(() => {
				setIsVisible(true);
				setHasAnimated(true);
			}, delay);

			return () => clearTimeout(timer);
		}

		if (observeIntersection) {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting && !hasAnimated) {
						setTimeout(() => {
							setIsVisible(true);
							setHasAnimated(true);
						}, delay);
					}
				},
				{
					threshold: 0.1,
					rootMargin: "0px 0px -50px 0px",
				},
			);

			if (elementRef.current) {
				observer.observe(elementRef.current);
			}

			return () => {
				if (elementRef.current) {
					observer.unobserve(elementRef.current);
				}
			};
		}
	}, [delay, hasAnimated, autoSlide, observeIntersection]);

	const getTransform = () => {
		if (isVisible) return "translate(0, 0)";

		switch (direction) {
			case "up":
				return `translate(0, ${distance}px)`;
			case "down":
				return `translate(0, -${distance}px)`;
			case "left":
				return `translate(${distance}px, 0)`;
			case "right":
				return `translate(-${distance}px, 0)`;
			case "top-left":
				return `translate(${distance}px, ${distance}px)`;
			case "top-right":
				return `translate(-${distance}px, ${distance}px)`;
			case "bottom-left":
				return `translate(${distance}px, -${distance}px)`;
			case "bottom-right":
				return `translate(-${distance}px, -${distance}px)`;
			default:
				return `translate(0, ${distance}px)`;
		}
	};

	return (
		<div
			ref={elementRef}
			className={`transition-all slide-in-element ${className}`}
			style={{
				transform: getTransform(),
				opacity: isVisible ? 1 : 0,
				transitionDuration: `${duration}ms`,
				transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
				transitionDelay: isVisible ? "0ms" : `${delay}ms`,
				willChange: "transform, opacity",
			}}
		>
			{children}
		</div>
	);
}
