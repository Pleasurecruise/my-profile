"use client";

import { useState, useEffect, useMemo } from "react";
import { MagicTweet } from "@/components/magicui/tweet-card";
import type { Tweet } from "react-tweet/api";

interface MomentClientProps {
  tweets: Tweet[];
}

export function MomentClient({ tweets }: MomentClientProps) {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const getColumnCount = () => {
      const width = window.innerWidth;
      if (width < 640) return 1;
      if (width < 1024) return 2;
      if (width < 1280) return 3;
      return 4;
    };

    setColumnCount(getColumnCount());

    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = useMemo(() => {
    const result: Tweet[][] = Array.from({ length: columnCount }, () => []);

    tweets.forEach((tweet, index) => {
      const columnIndex = index % columnCount;
      result[columnIndex].push(tweet);
    });

    return result;
  }, [tweets, columnCount]);

  if (tweets.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No moments yet
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-4">
        {columns.map((columnTweets, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col gap-4"
            style={{ minWidth: 0 }}
          >
            {columnTweets.map((tweet, tweetIndex) => {
              const key = tweet.id_str ?? `${columnIndex}-${tweetIndex}`;
              return <MagicTweet key={key} tweet={tweet} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
