import { generateAndHashOtp } from '@/lib/utils';
import { responseHelper, sendEmail } from '@/lib/helpers';
import rateLimit from '@/lib/ratelimit';
import { findUserByEmail } from '../../../../../db/users';
import { getAuthRequestByEmailAndAction, insertAuthRequest, updateAuthRequestStatusWithID } from '../../../../../db/auth';
const LOGIN_ACTION = 'login';


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

        const isEmailExists = await findUserByEmail(email);

        if (!isEmailExists) {
            return responseHelper({ message: 'Please signup first' , statusCode: 400, data: {}}, 200, limit, remaining);
        }

        const { otp, hashedOtp } = await generateAndHashOtp();

        const authRequestExists = await getAuthRequestByEmailAndAction(email, LOGIN_ACTION);

        if (authRequestExists.length) {
            const requestObj = authRequestExists[0];
            await updateAuthRequestStatusWithID(requestObj.id, new Date().toISOString(), hashedOtp, 'pending', LOGIN_ACTION);
        } else {
            await insertAuthRequest(new Date().toISOString(), new Date().toISOString(), hashedOtp, email, 'pending', LOGIN_ACTION);
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
