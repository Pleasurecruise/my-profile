/**
 * Homepage English translations
 *
 * Usage:
 *   import { home } from "@/data/i18n/home/en"
 *   <p>{home.about.p1}</p>
 *
 * Strings with `{variables}` must be interpolated at render time.
 */

export const home = {
  meta: {
    description: "Full-stack Developer · Any shortcomings are kindly overlooked. 🙏",
  },

  hero: {
    role: "Full-stack Developer",
  },

  about: {
    p1: "Any shortcomings are kindly overlooked. 🙏",
    p2: "Passionate computer science student at {university} with hands-on experience in {fullstack} development and {ai} technologies. Active contributor to open source projects mainly on {CherryStudio}. Building with React, Next.js, and TypeScript.",
    p3: "Off the keyboard, I ride road bikes, get lost in music, and sink hours into open-world games. A {hackathon} enthusiast who has competed across universities in 🇬🇧 — someday I hope to go full digital nomad, shipping open source from wherever the road takes me.",
    p4: "Currently I'm seeking a job opportunity. Click {here} to know me better :3",
    here: "here",
  },

  series: {
    heading: "My Series",
  },

  friends: {
    badge: "Friends & Connect",
    heading: "Friends",
  },

  connect: {
    heading: "Connect",
    email: "Email",
    wechat: "WeChat",
    instagram: "Instagram",
    discord: "Discord",
  },

  addLink: {
    heading: "Add my link",
    p1: "Feel free to exchange links! 👏🏻",
    p2: "Just add my link and submit yours via {github}.",
    name: "name",
    url: "url",
    avatar: "avatar",
    description: "description",
    descValue: "Any shortcomings are kindly overlooked 🙏",
  },

  footer: {
    inspiredBy: "Inspired by {magicuidesign}",
    sourceCode: "Source Code",
  },
} as const;
