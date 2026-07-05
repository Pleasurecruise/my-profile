/**
 * ホームページ日本語翻訳
 *
 * 使い方：
 *   import { home } from "@/data/i18n/home/ja"
 *   <p>{home.about.p1}</p>
 *
 * `{変数}` を含む文字列はレンダリング時に補間してください。
 */

export const home = {
  meta: {
    description: "フルスタック開発者 · 至らぬ点はご容赦ください 🙏",
  },

  hero: {
    role: "フルスタック開発者",
  },

  about: {
    p1: "至らぬ点はご容赦ください 🙏",
    p2: "{university}のコンピュータサイエンス専攻で、{fullstack}開発と{ai}技術の実践経験があります。主に{CherryStudio}でオープンソースに貢献しています。React、Next.js、TypeScriptでプロダクトを構築しています。",
    p3: "キーボードを離れると、ロードバイクに乗ったり、音楽に浸ったり、オープンワールドゲームに没頭しています。{hackathon}愛好家で、🇬🇧の様々な大学のハッカソンに参加してきました。いつかは完全なデジタルノマドになって、世界中どこからでもオープンソースを公開したいと思っています。",
    p4: "現在、仕事を探しています。もっと知りたい方は{here}をクリックしてください :3",
    here: "こちら",
  },

  series: {
    heading: "マイシリーズ",
  },

  friends: {
    badge: "友達 & 連絡先",
    heading: "友達",
  },

  connect: {
    heading: "連絡先",
    email: "メール",
    wechat: "WeChat",
    instagram: "Instagram",
    discord: "Discord",
  },

  addLink: {
    heading: "リンクを追加",
    p1: "お気軽にリンク交換してください！👏🏻",
    p2: "私のリンクを追加したら、{github}から情報を送ってください。",
    name: "名前",
    url: "URL",
    avatar: "アバター",
    description: "説明",
    descValue: "至らぬ点はご容赦ください 🙏",
  },

  footer: {
    inspiredBy: "{magicuidesign}にインスパイアされました",
    sourceCode: "ソースコード",
  },
} as const;
