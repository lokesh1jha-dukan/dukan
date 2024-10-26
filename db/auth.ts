import prisma from "@/lib/prisma/client";

export const getAuthRequestByEmailAndAction = async (email: string, action: string) => {
    const authRequest = await prisma.auth_requests.findMany({
        where: {
            email: email,
            action: action
        }
    });
    return authRequest;
}

export const updateAuthRequestStatusWithID = async (id: number, date_updated: string, hashed_otp: string, status: string, action: string) => {
    const authRequest = await prisma.auth_requests.update({
        where: {
            id: id
        },
        data: {
            date_updated,
            hashed_otp,
            status,
            action
        }
    });
    return authRequest;
}


export const insertAuthRequest = async (date_created: string, date_updated: string, hashed_otp: string, email: string, status: string, action: string) => {
    const authRequest = await prisma.auth_requests.create({
        data: {
            date_created,
            date_updated,
            hashed_otp,
            email,
            status,
            action
        }
    });
    return authRequest;
}

