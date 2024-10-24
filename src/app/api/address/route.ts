import { responseHelper } from '@/lib/helpers';
import { directus } from '@/lib/utils';
import { readItems, updateItem, createItem, deleteItem, readItem } from '@directus/sdk';

interface Address {
    user_id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    country?: string;
    pincode: string;
    created_at?: string;
    updated_at?: string;
}


export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const id = url.searchParams.get("id");
        const userId = url.searchParams.get("userid");

        let fetchAllAddresses: boolean = (id == undefined || id == null);

        if (fetchAllAddresses) {
            //@ts-ignore
            const addresses = await directus.request(readItems('addresses', {
                filter: { user_id: { _eq: userId } }
            }));
            return responseHelper({ message: 'Addresses fetched successfully', statusCode: 200, data: addresses }, 200);
        }

        if (!id) {
            return responseHelper({ message: 'Invalid request, address\'s id is missing', statusCode: 400, data: {} }, 400);
        }
        //@ts-ignore
        const addressItem = await directus.request(readItem('addresses', id));
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

        // If address is provided, create a new address
        if (address) {
            address.updated_at = new Date().toISOString();
            address.created_at = new Date().toISOString();
            await directus.request(createItem('addresses', { address }));
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

        if (id) {
            address.updated_at = new Date().toISOString();
            let result = await directus.request(updateItem('addresses', id, { address }));

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

        // If ID is provided, delete the address
        if (id) {
            await directus.request(deleteItem('addresses', id));
            return responseHelper({ message: 'Address deleted successfully', statusCode: 200, data: {} }, 200);
        } else {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}




