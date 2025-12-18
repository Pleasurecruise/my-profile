"use client";

import { useState, useCallback } from "react";
import { MagicTweet } from "@/components/magicui/tweet-card";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Shuffle } from "lucide-react";
import type { Tweet } from "react-tweet/api";

interface MomentClientProps {
  tweets: Tweet[];
}

export function MomentClient({ tweets }: MomentClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(
    new Set([0])
  );

  const handleShuffle = useCallback(() => {
    const availableIndices = tweets
      .map((_, i) => i)
      .filter((i) => !viewedIndices.has(i));

    if (availableIndices.length === 0) {
      const randomIndex = Math.floor(Math.random() * tweets.length);
      setViewedIndices(new Set([randomIndex]));
      setCurrentIndex(randomIndex);
    } else {
      const randomIndex =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];
      setViewedIndices((prev) => new Set([...prev, randomIndex]));
      setCurrentIndex(randomIndex);
    }
  }, [tweets, viewedIndices]);

  const currentTweet = tweets[currentIndex];

  if (!currentTweet) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-lg h-[60vh] overflow-auto">
        <MagicTweet tweet={currentTweet} />
      </div>
      <div className="flex items-center gap-3">
        <ShinyButton onClick={handleShuffle} className="gap-2">
          <Shuffle className="h-4 w-4 inline-block mr-1" />
          Shuffle
        </ShinyButton>
        <span className="text-sm text-muted-foreground">
          {viewedIndices.size} / {tweets.length}
        </span>
      </div>
    </div>
  );
}
