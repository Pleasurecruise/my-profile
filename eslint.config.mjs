import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/prisma/**",
      "src/components/magicui/**",
      "src/components/aceternityui/**",
      "src/components/ui/shadcn-io/**",
      "src/components/ui/file-tree.tsx",
    ],
  },
];

export default eslintConfig;
