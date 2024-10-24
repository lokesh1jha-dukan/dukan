import { isAuthenticatedAndUserData } from "@/lib/auth";
import { responseHelper } from "@/lib/helpers";
import prisma from "@/lib/prisma/client";
import { Address as AddressFromClient } from "@/types/client/types";

export async function POST(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }

        const { address }: { address: AddressFromClient } = await req.json();

        address.user_id = userId;
        address.created_at = new Date().toISOString();
        address.updated_at = new Date().toISOString();

        delete address.id;
        console.log(address, "address")

        const response = await prisma.addresses.create({
            data: address
        })

        if(response){
            return responseHelper({ message: 'Address not found', statusCode: 404, data: {} }, 404);
        }

        return responseHelper({ message: 'Address created successfully', statusCode: 200, data: {} }, 200);
    }
    catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}


export async function GET(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }

        const addresses = await prisma.addresses.findMany({
            where: {
                user_id: userId,
            },
        });
        if(!addresses){
            return responseHelper({ message: 'Addresses not found', statusCode: 404, data: {} }, 404);
        }

        return responseHelper({ message: 'Addresses fetched successfully', statusCode: 200, data: addresses }, 200);

    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}


export async function PATCH(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }

        const { address }: { address: AddressFromClient } = await req.json();
        console.log(address, "address")
        
        const response = await prisma.addresses.update({
            where: {
                id: address.id,
                user_id: userId
            },
            data: address
        })

        if(!response){
            return responseHelper({ message: 'Address not found', statusCode: 404, data: {} }, 404);
        }
        return responseHelper({ message: 'Address updated successfully', statusCode: 200, data: {} }, 200);
    } catch (error) {
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);       
    }
}

export async function DELETE(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }

        const { address } = await req.json();
        console.log(address, "address")
        const response = await prisma.addresses.delete({
            where: {
                id: address.id,
                user_id: userId
            }
        })

        if(!response){
            return responseHelper({ message: 'Address not found', statusCode: 404, data: {} }, 404);
        }

        return responseHelper({ message: 'Address deleted successfully', statusCode: 200, data: {} }, 200);
    } catch (error) {
        console.error('Internal server error:', error);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);       
    }
}