import BlurFade from "@/components/magicui/blur-fade";
import { getAllMomentTweets } from "@/server/moment";
import { MomentClient } from "./client";

const BLUR_FADE_DELAY = 0.04;

export default async function Moment() {
    const tweets = await getAllMomentTweets();

    return (
        <section>
            <BlurFade delay={BLUR_FADE_DELAY}>
                <h1 className="font-medium text-2xl mb-8 tracking-tighter">
                    Forward Posts on X
                </h1>
                <div className="flex justify-center">
                    <MomentClient tweets={tweets} />
                </div>
            </BlurFade>
        </section>
    );
}
