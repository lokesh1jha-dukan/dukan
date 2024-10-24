import { responseHelper, sendEmail } from '@/lib/helpers';
import rateLimit from '@/lib/ratelimit';
import { directus, generateAndHashOtp } from '@/lib/utils';
import { AuthRequest } from '@/types/api';
import { createItem, readItems, updateItem } from '@directus/sdk';

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 10, // Max 10 users per second
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || "no-ip";
        const token = `${ip}-signup`;
        const { remaining, limit } = await limiter.check(10, token);
        const { email } = await req.json();

        if (!email) {
            return responseHelper({ message: 'Email is required', statusCode: 400, data:{} }, 200, limit, remaining);
        }

        const userFilter = { filter: { email: { _eq: email } } };
        // @ts-ignore
        const isEmailExists = await directus.request(readItems('users', userFilter));

        const { otp, hashedOtp } = await generateAndHashOtp();
        const action = isEmailExists.length ? 'login' : 'signup';
        const authRequestFilter = { filter: { email: { _eq: email }, action: { _eq: action } } };
        // @ts-ignore
        const authRequestExists = await directus.request(readItems('auth_requests', authRequestFilter));
        if (authRequestExists.length) {
            const requestObj = authRequestExists[0] as AuthRequest;
            await directus.request(updateItem("auth_requests", requestObj.id, {
                date_updated: new Date().toISOString(),
                hashed_otp: hashedOtp,
                status: 'pending',
                action
            }));
        } else {
            await directus.request(createItem('auth_requests', {
                date_created: new Date().toISOString(),
                date_updated: new Date().toISOString(),
                hashed_otp: hashedOtp,
                email,
                status: 'pending',
                action
            }));
        }

        // Mail the OTP to the user
        let response = sendEmail(email, otp.toString());
        if(!response) {
            return responseHelper({ message: 'Error sending OTP to email', statusCode: 400,data:{} }, 200, limit, remaining);
        }
        return responseHelper({ message: 'OTP sent to your email', statusCode: 400, data:{}}, 200, limit, remaining);
    } catch (error) {
        console.error(error);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data:{} }, 500);
    }
}
