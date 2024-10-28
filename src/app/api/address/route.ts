import { responseHelper } from '@/lib/helpers';
import { createAddressByUserId, deleteAddressByUserId, getAddressByIdAndUserId, getAllAddressesByUserId, updateAddressByUserId } from '../../../../db/users';
// import { Address } from '@/types/server/types';
// import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        const userId = url.searchParams.get("userid");

        const fetchAllAddresses = !id;

        if (fetchAllAddresses && userId) {
            const addresses = await getAllAddressesByUserId(parseInt(userId));
            return responseHelper({ message: 'Addresses fetched successfully', statusCode: 200, data: addresses }, 200);
        }

        if (!id || !userId) {
            return responseHelper({ message: 'Invalid request, address\'s id is missing', statusCode: 400, data: {} }, 400);
        }

        const addressItem = await getAddressByIdAndUserId(parseInt(id), parseInt(userId));
        if (!addressItem) {
            return responseHelper({ message: 'Address not found', statusCode: 404, data: {} }, 404);
        }
        return responseHelper({ message: 'Address fetched successfully', statusCode: 200, data: addressItem }, 200);

    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

export async function POST(req: Request) {
    try {
        const { address, user_id } = await req.json();
        if (address && user_id) {
            address.updated_at = new Date().toISOString();
            address.created_at = new Date().toISOString();
            await createAddressByUserId(user_id, address);
            return responseHelper({ message: 'Address created successfully', statusCode: 200, data: {} }, 200);
        }
        return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);

    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, address, user_id } = await req.json();
        if (id && address && user_id) {
            address.updated_at = new Date().toISOString();
            const result = await updateAddressByUserId(user_id, address);
            if (!result) {
                return responseHelper({ message: 'Address not found or not updated', statusCode: 404, data: {} }, 404);
            }
            return responseHelper({ message: 'Address updated successfully', statusCode: 200, data: {} }, 200);
        }
        return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);

    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

export async function DELETE(req: Request) {
    try {
        const { id, user_id } = await req.json();
        if (id && user_id) {
            await deleteAddressByUserId(user_id, id);
            return responseHelper({ message: 'Address deleted successfully', statusCode: 200, data: {} }, 200);
        } else {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}
