import { responseHelper } from '@/lib/helpers';
import { findUserById } from '../../../../db/users';

export async function PATCH(req: Request) {
    try {
        const { userId, personalInfo } = await req.json();

        if (!userId) {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }



        return responseHelper({
            message: 'User details updated successfully',
            statusCode: 200,
            data: {}
        }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

// Handler for GET requests
export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const userId = url.searchParams.get("userid");

        if (!userId) {
            return responseHelper({ message: 'Invalid request, user\'s id is missing', statusCode: 400, data: {} }, 400);
        }

        // Fetch user details
        //@ts-ignore
        const userDetails = await findUserById(userId);
        if (!userDetails) {
            return responseHelper({ message: 'User not found', statusCode: 400, data: {} }, 404);
        }
        // Return user details as the response
        return responseHelper({
            message: 'User profile details fetched successfully',
            statusCode: 200,
            data: userDetails
        }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}
