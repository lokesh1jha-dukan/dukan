import config from '@/config';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { Cart, CartItem, CartItemQuantity } from '@/types/client/types';

export async function sendEmail(to: string, otp: string) {
    try {
        // Create a Nodemailer transporter with SMTP settings
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.email.admin,
                pass: config.email.adminPwd,
            },
        });
        // Define email options
        const mailOptions = {
            from: config.email.admin,
            to,
            subject: 'OTP Verification',
            text: `Your OTP is ${otp}`,
            html: generateEmailText(to, otp),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}


function generateEmailText(name: string, otp: string): string {
    const BRAND_NAME = config.appName;

    return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">${BRAND_NAME}</a>
                    </div>
                    <p style="font-size:1.1em">Hi, ${name}</p>
                    <p>Thank you for choosing ${BRAND_NAME}. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                    <p style="font-size:0.9em;">Regards,<br />${BRAND_NAME}</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>${BRAND_NAME} Inc</p>
                        <p>1600 Amphitheatre Parkway</p>
                        <p>Manipur, India</p>
                    </div>
                </div>
            </div>`;
}


function createToken(payload: object, secret: string, expiresIn: string): string {
    return jwt.sign(payload, secret, { expiresIn});
}

// Not use this function => goto lib/auth
function verifyToken(token: string, secret: string): string | object {
    return jwt.verify(token, secret);
}

export const jwtHelpers = {
    createToken,
    verifyToken
}

type ResponseObject = {
    message: string,
    data: {},
    statusCode: number,
}

export const responseHelper = (res: ResponseObject, status: number, limit?: number, remaining?: number) => {
    const response = new NextResponse(JSON.stringify({ response: res, }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...(limit && { 'X-RateLimit-Limit': limit.toString() }),
            ...(remaining && { 'X-RateLimit-Remaining': remaining.toString() }),
        },
    });
    return response;
};


