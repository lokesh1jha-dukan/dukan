import { responseHelper, sendEmail } from '@/lib/helpers';
import rateLimit from '@/lib/ratelimit';
import { generateAndHashOtp } from '@/lib/utils';
import { findUserByEmail } from '../../../../../db/users';
import { getAuthRequestByEmailAndAction, insertAuthRequest, updateAuthRequestStatusWithID } from '../../../../../db/auth';

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

        const isEmailExists = await findUserByEmail(email);

        const { otp, hashedOtp } = await generateAndHashOtp();
        const action = isEmailExists ? 'login' : 'signup';
        const authRequestExists = await getAuthRequestByEmailAndAction(email, action);

        if (authRequestExists.length) {
            const requestObj = authRequestExists[0];
            await updateAuthRequestStatusWithID(requestObj.id, new Date().toISOString(), hashedOtp, 'pending', action);
        } else {
            await insertAuthRequest(new Date().toISOString(), new Date().toISOString(), hashedOtp, email, 'pending', action);
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
