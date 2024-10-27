import { responseHelper } from '@/lib/helpers';
import { createAddressByUserId, deleteAddressByUserId, getAllAddressesByUserId, updateAddressByUserId } from '../../../../db/users';
import { Address } from '@/types/server/types';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const id = url.searchParams.get("id");
        // TODO: Fetch user details from token
        const userId = url.searchParams.get("userid");

        let fetchAllAddresses: boolean = (id == undefined || id == null);

        if (fetchAllAddresses) {
            //@ts-ignore
            const addresses = await getAllAddressesByUserId(userId);
            return responseHelper({ message: 'Addresses fetched successfully', statusCode: 200, data: addresses }, 200);
        }

        if (!id) {
            return responseHelper({ message: 'Invalid request, address\'s id is missing', statusCode: 400, data: {} }, 400);
        }
        //@ts-ignore
        const addressItem = await getAddressByIdAndUserId(id, userId);

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
        const { address }: { address: Address; } = await req.json();
        // TODO: Fetch user details from token
        const { user_id } = await req.json();

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
        const { id, address }: { id: string; address: Address } = await req.json();
        // TODO: Fetch user details from token
        const { user_id } = await req.json();

        if (id && address && user_id) {
            address.updated_at = new Date().toISOString();

            await updateAddressByUserId(user_id, address);
            // TODO: check if result is not null the change the response
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
        const { id } = await req.json();

        // TODO: Fetch user details from token
        const { user_id } = await req.json();
        // If ID is provided, delete the address
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




