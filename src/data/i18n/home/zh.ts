/**
 * 首页中文翻译
 *
 * 使用方式：
 *   import { home } from "@/data/i18n/home/zh"
 *   <p>{home.about.p1}</p>
 *
 * 带 `{变量}` 的文本需要在渲染时做插值替换。
 */

export const home = {
  meta: {
    description: "全栈开发者 · 不足之处 敬请谅解 🙏",
  },

  hero: {
    role: "全栈开发者",
  },

  about: {
    p1: "不足之处 敬请谅解 🙏",
    p2: "就读于{university}的计算机科学学生，在{fullstack}开发和{ai}技术方面有实践经验。活跃于开源项目贡献者，主要为{CherryStudio}贡献代码。使用 React、Next.js 和 TypeScript 构建项目。",
    p3: "离开键盘后，我喜欢骑公路车、沉浸在音乐里、或者沉迷于开放世界游戏。我是{hackathon}爱好者，曾参加🇬🇧多所大学的黑客松——希望有一天能成为数字游民，走到哪开源到哪。",
    p4: "目前我正在寻找工作机会。点击{here}来更好地了解我 :3",
    here: "这里",
  },

  series: {
    heading: "我的系列",
  },

  friends: {
    badge: "朋友们 & 联系方式",
    heading: "朋友们",
  },

  connect: {
    heading: "联系方式",
    email: "邮件",
    wechat: "微信",
    instagram: "Instagram",
    discord: "Discord",
  },

  addLink: {
    heading: "添加友链",
    p1: "欢迎交换友链！👏🏻",
    p2: "添加我的链接后，通过{github}提交你的信息即可。",
    name: "名称",
    url: "链接",
    avatar: "头像",
    description: "描述",
    descValue: "不足之处 敬请谅解 🙏",
  },

  footer: {
    inspiredBy: "灵感来源于{magicuidesign}",
    sourceCode: "源代码",
  },
} as const;
