import config from "@/config";
// since jwtverify dosent work on edge. Here jose npm package is used
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";


export const verifyAuth = async (token: string, secret: string) => {
    try {
        let verified = await jwtVerify(token, new TextEncoder().encode(secret));
        const { exp, ...payload } = verified.payload;

        if (exp && Date.now() >= exp * 1000) {
            console.error('Token has expired');
            return null;
        }

        return verified.payload;
    } catch (error) {
        console.error("error in verifyAuth", error);
        return null;
    }
}


type AuthData = {
    isAuthenticated: boolean;
    user?: AuthUser | null;
}

export enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

export type AuthUser =  {
    id: number;
    username: string;
    email: string;
    password_hash: null;
    created_at: string;
    last_login: null;
    updated_at: Date;
    iat: Date;
    exp: Date;
    role: Role
} 



export const isAuthenticatedAndUserData = async():Promise<AuthData> => {
    try {
    const cookieStore = cookies()
    const token = cookieStore.get('token');
    if (token) {
        let verified = await jwtVerify(token.value, new TextEncoder().encode(config.jwtSecret));
        const userData = verified.payload as unknown as AuthData['user'];
        let adminEmailArray = (config.adminEmail).split(",");
        if (userData && adminEmailArray.includes(userData.email)) {
            userData.role = Role.ADMIN
        }else if(userData){
            userData.role = Role.USER
        }
        return {
            isAuthenticated: true,
            user: userData 
        }
    } else {
        return {
            isAuthenticated: false,
            user: null
        }
    }
    } catch (error) {
        const cookieStore = cookies()
        const token = cookieStore.get('token');
        console.error("error in isAuthenticatedAndUserData", error, token, config.jwtSecret);
        return {
            isAuthenticated: false,
            user: null
        }
    }
}