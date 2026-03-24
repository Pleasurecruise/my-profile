"use client";

import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { useRef, useState } from "react";
import {
	Card,
	Carousel,
	type CarouselHandle,
} from "@/components/aceternityui/apple-cards-carousel";
import { GALLERY_ITEMS } from "@/data/gallery";

export default function GalleryPage() {
	const carouselRef = useRef<CarouselHandle>(null);
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(true);

	const handleScroll = () => {
		setCanLeft(carouselRef.current?.canScrollLeft ?? false);
		setCanRight(carouselRef.current?.canScrollRight ?? true);
	};

	const cards = GALLERY_ITEMS.map((item, index) => (
		<Card
			key={item.title}
			card={{
				src: item.src,
				title: item.title,
				category: item.category,
				content: null,
			}}
			index={index}
		/>
	));

	return (
		<div className="w-full h-[calc(100dvh-9rem)] sm:h-[calc(100dvh-12rem)] overflow-hidden flex flex-col">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-medium text-2xl tracking-tighter">Gallery</h1>
					<p className="text-muted-foreground text-sm mt-1">
						A collection of photos
					</p>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 disabled:opacity-30 dark:bg-neutral-800"
						onClick={() => {
							carouselRef.current?.scrollLeft();
							handleScroll();
						}}
						disabled={!canLeft}
					>
						<IconArrowNarrowLeft className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
					</button>
					<button
						type="button"
						className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 disabled:opacity-30 dark:bg-neutral-800"
						onClick={() => {
							carouselRef.current?.scrollRight();
							handleScroll();
						}}
						disabled={!canRight}
					>
						<IconArrowNarrowRight className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
					</button>
				</div>
			</div>
			<Carousel ref={carouselRef} items={cards} />
		</div>
	);
}
