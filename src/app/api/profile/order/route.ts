import { isAuthenticatedAndUserData } from "@/lib/auth";
import { responseHelper } from "@/lib/helpers";
import prisma from "@/lib/prisma/client";

export async function GET(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        // Join order and order_items tables and order items will come as array of objects in orders column
        const getAllOrdersByUserId = await prisma.orders.findMany({
            where: {
                user_id: userId
            },
            include: {
                order_items: true
            },
            orderBy: {
                order_date: 'desc'
            }
        })

        if (!getAllOrdersByUserId) {
            return responseHelper({ message: 'Orders not found', statusCode: 404, data: {} }, 404);
        }

        return responseHelper({ message: 'Orders fetched successfully', statusCode: 200, data: getAllOrdersByUserId }, 200);
    } catch (err) {
        console.error('Internal server error:', JSON.stringify(err));
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

        const {orderId, status} = await req.json();
        const response = await prisma.orders.update({
            where: {
                id: orderId
            },
            data: {
                status: status
            }
        })

        if(!response){
            return responseHelper({ message: 'Order not found', statusCode: 404, data: {} }, 404);
        }

        return responseHelper({ message: 'Order updated successfully', statusCode: 200, data: {} }, 200);
    } catch (error) {
        console.error('Internal server error:', JSON.stringify(error));
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);       
    }
}
