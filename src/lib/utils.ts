import { authentication, createDirectus, rest } from "@directus/sdk";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto' 
import bcrypt from 'bcryptjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const directus = createDirectus('https://directus-qo80kg8.coolify.ranjeet.xyz').with(
  rest({
    onRequest: (options) => ({ ...options, cache: 'no-store' }),
  })
);


export const withAuthDirectus = createDirectus("https://directus-qo80kg8.coolify.ranjeet.xyz").with(authentication('session')).with(rest(
  {
    onRequest: (options) => ({ ...options, cache: 'no-store' }),
  })
);


export const generateAndHashOtp = async () => {
  const otp = crypto.randomInt(100000, 999999)
  const hashedOtp = await bcrypt.hash(otp.toString(), 10)
  return {otp, hashedOtp}
}

export const verifyOtp = async (otp: string, hashedOtp: string) => {
  return await bcrypt.compare(otp, hashedOtp)
}
