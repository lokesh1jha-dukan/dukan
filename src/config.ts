import { ConfigProps } from "@/types";

const config: ConfigProps = {
    domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME!,
    appName: process.env.NEXT_PUBLIC_APP_NAME!,
    jwtSecret: process.env.JWT_SECRET!,
    directusDomain: process.env.DIRECTUS_DOMAIN!,
    directusFileDomain: `${process.env.DIRECTUS_DOMAIN!}/assets`,
    redis: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
        password: process.env.REDIS_PASSWORD!,
    },
    email: {
        admin: process.env.ADMIN_EMAIL_ID!,
        adminPwd: process.env.ADMIN_EMAIL_PASSWORD!,
    },
    order_status: {
        ORDER_PLACED: "order_placed",
        OUT_FOR_DELIVERY: "out_for_delivery",
        DELIVERED: "delivered",
        CANCELLED: "cancelled",
    },
    adminEmail: process.env.ADMIN_LOGIN_EMAIL_ID!,
}

export default config

