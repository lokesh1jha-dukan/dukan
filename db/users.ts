import prisma from "@/lib/prisma/client";

export const findUserByEmail = async (email: string) => {
    const user = await prisma.users.findUnique({
        where: {
            email: email,
        },
    });
    return user;
};