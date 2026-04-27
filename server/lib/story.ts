import { compileForClient } from "@my-profile/ui/markdown";
import { STORY_MARKDOWN } from "@/data/story";
import type { StoryData } from "@shared/story";

export type { StoryData };

const GLOBE_SPLIT_MARKER = "### 性格与爱好";

export async function getStoryData(): Promise<StoryData> {
  const markdown = STORY_MARKDOWN;
  const globeIndex = markdown.indexOf(GLOBE_SPLIT_MARKER);
  const before = globeIndex !== -1 ? markdown.slice(0, globeIndex) : markdown;
  const after = globeIndex !== -1 ? markdown.slice(globeIndex) : "";

  const [beforeResult, afterResult] = await Promise.all([
    compileForClient(before),
    after ? compileForClient(after) : Promise.resolve(null),
  ]);

  return {
    beforeCode: beforeResult.code,
    afterCode: afterResult?.code ?? "",
  };
}
