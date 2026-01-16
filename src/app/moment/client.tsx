"use client";

import { useState, useEffect, useMemo } from "react";
import { MagicTweet } from "@/components/magicui/tweet-card";
import { Marquee } from "@/components/magicui/marquee";
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
    <div className="w-full h-[70vh] overflow-hidden">
      <div className="flex gap-4 h-full">
        {columns.map((columnTweets, columnIndex) => (
          <div key={columnIndex} className="flex-1 h-full overflow-hidden">
            <Marquee
              vertical
              reverse={columnIndex % 2 === 1}
              pauseOnHover
              className="h-full"
            >
              {columnTweets.map((tweet, tweetIndex) => {
                const key = tweet.id_str ?? `${columnIndex}-${tweetIndex}`;
                return (
                  <div key={key} className="py-4">
                    <MagicTweet tweet={tweet} />
                  </div>
                );
              })}
            </Marquee>
          </div>
        ))}
      </div>
    </div>
  );
}
