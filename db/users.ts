import prisma from "@/lib/prisma/client";
import { Address } from "@/types/server/types";

export const findUserByEmail = async (email: string) => {
    const user = await prisma.users.findUnique({
        where: {
            email: email,
        },
    });
    return user;
};

export const getAllAddressesByUserId = async (userId: number) => {
    const addresses = await prisma.addresses.findMany({
        where: {
            user_id: userId
        }
    });
    return addresses;
}

export const getAddressByIdAndUserId = async (addressId: number, userId: number) => {
    const address = await prisma.addresses.findFirst({
        where: {
            id: addressId,
            user_id: userId
        }
    });
    return address;
}


export const createAddressByUserId = async (userId: number, address: Address) => {
    const createdAddress = await prisma.addresses.create({
        data: {
            ...address,
            user_id: userId
        }
    });
    return createdAddress;
}


export const updateAddressByUserId = async (userId: number, address: Address) => {
    const updatedAddress = await prisma.addresses.update({
        where: {
            id: address.id,
            user_id: userId
        },
        data: {
            ...address
        }
    });
    return updatedAddress;
}

export const deleteAddressByUserId = async (userId: number, addressId: number) => {
    const deletedAddress = await prisma.addresses.delete({
        where: {
            id: addressId,
            user_id: userId
        }
    });
    return deletedAddress;
}