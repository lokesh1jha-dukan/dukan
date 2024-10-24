import { directus, verifyOtp } from '@/lib/utils';
import { createItem, readItem, readItems, updateItem, updateItems } from '@directus/sdk';
import { NextResponse } from 'next/server';
import { jwtHelpers, responseHelper, sendEmail } from '@/lib/helpers';
import { cookies } from 'next/headers';
import config from '@/config';
import rateLimit from '@/lib/ratelimit';
import { AuthRequest } from '@/types/api';
import { Role, isAuthenticatedAndUserData } from '@/lib/auth';


const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 10, // Max 500 users per second
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || "no-ip";
        const token = `${ip}-verify`
        const { remaining, limit } = await limiter.check(10, token)
        const { otp, email, first_name, last_name } = await req.json()
        //@ts-ignore
        const authRequest = await directus.request(readItems('auth_requests', {
            filter: {
                email: {
                    _eq: email
                },
                status: {
                    _eq: 'pending'
                }
            }
        }))

        if (!authRequest.length) {
            return responseHelper({ message: 'Expired OTP', statusCode: 404, data: {} }, 200, limit, remaining,)
        }

        const requestObj = authRequest[0] as AuthRequest
        const isVerified = await verifyOtp(otp, requestObj.hashed_otp)
        if (!isVerified) {
            return responseHelper({ message: 'Invalid OTP', statusCode: 400, data: {} }, 200, limit, remaining)
        }
        if (requestObj.action === 'login') {
            const isVerified = await verifyOtp(otp, requestObj.hashed_otp)
            if (isVerified) {
                //@ts-ignore
                const user = await directus.request(readItems('users', {
                    filter: { email: { _eq: email } }
                }));
                await directus.request(updateItem('auth_requests', requestObj.id, {
                    status: 'verified',
                    date_updated: new Date().toISOString()
                }))
                const token = jwtHelpers.createToken(user[0], config.jwtSecret, '7 days')
                cookies().set('token', token, {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax',
                    path: '/'
                })
                const role = checkIfAdmin(email)
                return responseHelper({ message: 'OTP verified', statusCode: 200, data: { role } }, 200, limit, remaining)
            }
        } else {
            const isVerified = await verifyOtp(otp, requestObj.hashed_otp)
            if (isVerified) {
                await directus.request(updateItem('auth_requests', requestObj.id, {
                    status: 'verified',
                    date_updated: new Date().toISOString()
                }))
                const user = await directus.request(createItem('users', {
                    email,
                    first_name,
                    last_name,
                    date_created: new Date().toISOString(),
                    date_updated: new Date().toISOString()
                }))
                const token = jwtHelpers.createToken(user, config.jwtSecret, '7 days',)
                cookies().set('token', token, {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax',
                    path: '/'
                })
                const role = checkIfAdmin(email)

                return responseHelper({ message: 'OTP verified', statusCode: 200, data: {role} }, 200, limit, remaining)
            }
        }
    } catch (error) {
        console.log(error)
        if ((error as Error)?.message === "Rate limit exceeded") {
            return responseHelper({ message: 'Rate limit exceeded', statusCode: 429, data: {} }, 429)
        }
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500)
    }

    // check if email exists in the database

}

export async function GET() {
    try {

        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }

        return responseHelper({ message: 'User authenticated', statusCode: 200, data: { user : auth.user } }, 200);
    } catch (error) {
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}


function checkIfAdmin(email: string) {
    let role = Role.USER
    let adminEmailArray = (config.adminEmail).split(",");
    if (adminEmailArray.includes(email)) {
        role = Role.ADMIN
    }
    return role
}