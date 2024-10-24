"use client"
import { fetchInsideTryCatch } from "@/lib/client/apiUtil"


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


const isAuthenticatedAndUserId = async () => {
    const response = await fetchInsideTryCatch<AuthData>('api/auth/verify')
        
    if (response && response.response.statusCode === 200 && response.response.data) {
        return {
            isAuthenticated: true,
            userData: response.response.data
        }
      }
    return {
        isAuthenticated: false
    }
}


 export default isAuthenticatedAndUserId
