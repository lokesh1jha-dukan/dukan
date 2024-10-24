/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "directus-qo80kg8.coolify.ranjeet.xyz",
            }
        ]
    }
};

export default nextConfig;
