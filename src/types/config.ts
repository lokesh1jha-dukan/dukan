import { directus } from '@/lib/utils';
export interface ConfigProps {
    domainName: string;
    appName: string;
    jwtSecret: string;
    directusDomain: string;
    directusFileDomain: string;
    redis: {
        host: string;
        port: number;
        password: string;
    };
    email: {
        admin: string;
        adminPwd: string;
    },
    order_status: {
        ORDER_PLACED: string,
        OUT_FOR_DELIVERY: string,
        DELIVERED: string,
        CANCELLED: string,
    },
    adminEmail: string,
}

