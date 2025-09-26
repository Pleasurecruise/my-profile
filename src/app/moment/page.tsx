import { Marquee } from "@/components/magicui/marquee";
import {TweetCard} from "@/components/magicui/tweet-card";
import BlurFade from "@/components/magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

const reviews = [
    { id: "1944677611055317467" },
    { id: "1969249914853929098" },
    { id: "1966491149067280403" },
    { id: "1971481266123157536" },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

export default async function Moment() {

    return (
        <BlurFade delay={BLUR_FADE_DELAY}>
            <section id="contact">
                <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
                    <div className="space-y-3">
                        <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                            Moment
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            Share My Moment
                        </h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Want to see what I&apos;ve been up to? Check out my latest updates and experiences on Twitter!
                        </p>
                    </div>
                </div>
            </section>

            <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
                {/*竖直方向滚动vertical*/}
                <Marquee pauseOnHover className="[--duration:20s]">
                    {firstRow.map((review, index) => (
                        <TweetCard key={index} id={review.id}/>
                    ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
            </div>

            <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
                <Marquee reverse pauseOnHover className="[--duration:20s]">
                    {secondRow.map((review, index) => (
                        <TweetCard key={index} id={review.id}/>
                    ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
            </div>
        </BlurFade>
    );
}
