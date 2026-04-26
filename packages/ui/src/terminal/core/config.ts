export interface TerminalConfig {
  /** Shown in the title bar and prompt, e.g. "pleasure1234@website" */
  hostname?: string;

  /** /skills output */
  skills: string[];

  /** /social output */
  social: Array<{ name: string; url: string }>;

  /** /contact output */
  contact: {
    email: string;
    telegram?: string;
    wechat?: string;
  };

  /** /projects output */
  projects: Array<{ title: string; dates: string }>;

  /** /links output */
  friends: Array<{ name: string; url: string }>;

  /** /go destinations — key is the route name, value is the path */
  routes?: Record<string, string>;

  /** /am-i-ok fetch URL, defaults to "/api/am-i-ok" */
  amIOkUrl?: string;

  /** MOTD profile section */
  profile: {
    displayName: string;
    username: string;
    location?: string;
    projectCount?: number;
    hackathonCount?: number;
    university?: string;
    degree?: string;
    graduationYear?: string;
    bio?: string;
    contributions?: Array<{ label: string; url: string }>;
    founded?: Array<{ label: string; url: string }>;
  };
}
