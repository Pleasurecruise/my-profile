import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@my-profile/ui"],
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "/u/**",
			},
			{
				protocol: "https",
				hostname: "img-cn.static.isla.fan",
			},
			{
				protocol: "https",
				hostname: "gravatar.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
	serverExternalPackages: ["ali-oss"],
};

export default nextConfig;
