import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compileForClient } from "@my-profile/ui/markdown";

const GLOBE_SPLIT_MARKER = "### 性格与爱好";

export type StoryData = {
  beforeCode: string;
  afterCode: string;
};

export async function getStoryData(): Promise<StoryData> {
  const filePath = join(process.cwd(), "content/story.md");
  const markdown = readFileSync(filePath, "utf-8");

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
