import { directus, generateAndHashOtp } from '@/lib/utils';
import { readItems, updateItem, createItem } from '@directus/sdk';
import { responseHelper, sendEmail } from '@/lib/helpers';
import rateLimit from '@/lib/ratelimit';
import { AuthRequest } from '@/types/api';

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
            return responseHelper({ message: 'Email is missing', statusCode: 400, data: {} }, 200, limit, remaining);
        }
        //@ts-ignore
        const isEmailExists = await directus.request(readItems('users', {
            filter: { email: { _eq: email } }
        }));

        if (!isEmailExists.length) {
            return responseHelper({ message: 'Please signup first' , statusCode: 400, data: {}}, 200, limit, remaining);
        }

        const { otp, hashedOtp } = await generateAndHashOtp();
        //@ts-ignore
        const authRequestExists = await directus.request(readItems('auth_requests', {
            filter: {
                email: { _eq: email },
                action: { _eq: 'login' }
            }
        }));

        if (authRequestExists.length) {
            const requestObj = authRequestExists[0] as AuthRequest;
            await directus.request(updateItem('auth_requests', requestObj.id, {
                date_updated: new Date().toISOString(),
                hashed_otp: hashedOtp,
                status: 'pending',
                action: 'login'
            }));
        } else {
            await directus.request(createItem('auth_requests', {
                date_created: new Date().toISOString(),
                date_updated: new Date().toISOString(),
                hashed_otp: hashedOtp,
                email,
                status: 'pending',
                action: 'login'
            }));
        }

        try {
            let isMailSent =  await sendEmail(email, otp.toString());
            if (!isMailSent) {
                return responseHelper({ message: 'Error sending email', statusCode: 400, data: {} }, 200, limit, remaining);
            }
        } catch (err) {
            console.error('Error sending email:', err);
            return responseHelper({ message: 'Error sending email', statusCode: 400, data: {} }, 200, limit, remaining);
        }

        return responseHelper({ message: 'OTP sent to your email', statusCode: 200, data: {} }, 200, limit, remaining);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 400 , data:{}}, 500);
    }
}
