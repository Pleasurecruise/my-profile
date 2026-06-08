export interface FriendLink {
  name: string;
  url: string;
  avatar: string;
}

export interface MySeriesLink {
  name: string;
  url: string;
  emoji: string;
  description?: string;
}

export const MY_SERIES: MySeriesLink[] = [
  {
    name: "my-profile",
    url: "https://you-find.me",
    emoji: "🏠",
    description: "Personal website & portfolio",
  },
  {
    name: "my-memos",
    url: "https://memos.you-find.me",
    emoji: "📝",
    description: "My digital memos & notes",
  },
  {
    name: "my-moment",
    url: "https://moment.you-find.me",
    emoji: "⏳",
    description: "Moments gallery & timeline",
  },
  {
    name: "my-cv",
    url: "https://resume.yiming1234.cn",
    emoji: "📄",
    description: "My CV & resume",
  },
  {
    name: "my-monorepo",
    url: "https://github.com/Pleasurecruise/my-monorepo",
    emoji: "📦",
    description: "AI infra monorepo template for quick startup",
  },
  {
    name: "my-env",
    url: "https://github.com/Pleasurecruise/my-env",
    emoji: "🐳",
    description: "Dev environment with Docker",
  },
  {
    name: "my-minecraft",
    url: "https://github.com/Pleasurecruise/my-minecraft",
    emoji: "🎮",
    description: "My Minecraft process",
  },
];

export const FRIENDS: FriendLink[] = [
  {
    name: "xuanzhi33",
    url: "https://xuanzhi33.cn",
    avatar: "https://avatars.githubusercontent.com/u/37460139",
  },
  {
    name: "Ivan Hanloth",
    url: "https://ivan-hanloth.cn",
    avatar: "https://avatars.githubusercontent.com/u/81500828",
  },
  {
    name: "eeee0717",
    url: "https://chentao0717.cn",
    avatar: "https://avatars.githubusercontent.com/u/70054568",
  },
  {
    name: "Hakadao",
    url: "https://hakadao.cc",
    avatar: "https://avatars.githubusercontent.com/u/33394391",
  },
  {
    name: "tcdw",
    url: "https://tcdw.net",
    avatar: "https://avatars.githubusercontent.com/u/8687182",
  },
  {
    name: "Hikaru Lab",
    url: "https://www.mengxiblog.top",
    avatar: "https://img-cn.static.isla.fan/2025/10/19/68f4824b7c228.png",
  },
  {
    name: "溴化锂的笔记本",
    url: "https://nvme0n1p.dev",
    avatar:
      "https://gravatar.com/avatar/29d64df3ca2a9dac5a7fffa5372fb80fb3270ceb223de2af0c33cdc4b2cbe954?v=1687917579000&size=256&d=initials",
  },
  {
    name: "Innei",
    url: "https://innei.in",
    avatar: "https://avatars.githubusercontent.com/u/41265413",
  },
];
