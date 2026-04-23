import BlurFade from "@/components/magicui/blur-fade";
import { MasonryGallery } from "./masonry-gallery";
import { getGalleryPhotos } from "@/server/notion-gallery";

export default async function GalleryPage() {
	const photos = await getGalleryPhotos();

	return (
		<section>
			<BlurFade delay={0.04}>
				<MasonryGallery items={photos} />
			</BlurFade>
		</section>
	);
}
