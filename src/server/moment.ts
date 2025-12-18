import { getTweet, type Tweet } from "react-tweet/api";
import { MOMENT_IDS } from "@/data/moment";

export async function getAllMomentTweets(): Promise<Tweet[]> {
  const tweets = await Promise.all(
    MOMENT_IDS.map(async (id) => {
      try {
        return await getTweet(id);
      } catch (error) {
        console.error(`Failed to fetch tweet ${id}:`, error);
        return null;
      }
    })
  );

  return tweets.filter((tweet): tweet is Tweet => tweet !== null);
}
