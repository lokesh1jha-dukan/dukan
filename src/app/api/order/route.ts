import { responseHelper } from '@/lib/helpers';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import prisma from '@/lib/prisma/client';
import config from '@/config';
import { Order } from '@/types/server/types';

// TODO Get detail of order by order id
export async function GET(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }

        const orders = await prisma.orders.findMany({
            where: {
                user_id: userId,
            },
        });

        return responseHelper({ message: 'Orders fetched successfully', statusCode: 200, data: orders }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

export async function POST(req: Request) {
    try {
        const auth = await isAuthenticatedAndUserData();
        const userId = auth.user?.id;
        const { addressId, paymentOption, fullAddress, cartTotal } = await req.json();

        if (!userId) {
            return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
        }

        const detailedOrder: any[] = await prisma.$queryRaw`
        select c.user_id, c.product_id, c.cart_quantity, q.quantity,
        q.price, p.name , p.description
        from cart as c
        join quantity as q on c.quantity_id = q.id
        join products as p on c.product_id = p.id
        where c.user_id = ${userId}`

        const totalAmount = detailedOrder.reduce((acc, curr) => acc + curr.cart_quantity * Number(curr.price), 0);

        if (totalAmount !== cartTotal) {
            return responseHelper({ message: 'Cart total does not match', statusCode: 400, data: {} }, 400);
        }

        const newOrder = await prisma.$transaction(async (prisma) => {
            const order: Order[] = await prisma.$queryRaw`
                INSERT INTO orders (user_id, total_amount, status, order_date, created_at, updated_at, address_id, full_address)
                VALUES (${userId}, ${totalAmount}, ${config.order_status.ORDER_PLACED}, NOW(), NOW(), NOW(), ${Number(addressId)}, ${fullAddress})
                RETURNING *
            `;
            console.log(order, 'order');
            // return;
            const orderId: number = order[0].id;
            const orderItems = detailedOrder.map((item) => ({
                order_id: orderId,
                product_id: item.product_id,
                product_name: item.name,
                product_quantity: item.quantity,
                quantity: item.cart_quantity,
                price_per_unit: item.price,
                created_at: new Date(),
                updated_at: new Date(),
            }));

            const orderItemsCreated = await prisma.order_items.createMany({
                data: orderItems
            });

            await prisma.payments.create({
                data: {
                    user_id: userId,
                    order_id: orderId,
                    payment_date: new Date(),
                    amount: totalAmount,
                    payment_method: paymentOption,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            });

            await prisma.cart.deleteMany({ where: { user_id: userId } });

            return order;
        });

        

        return responseHelper({ message: 'Order placed successfully', statusCode: 200, data: newOrder }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

export async function PATCH(req: Request) {
    try {
        const { orderId, userId, status } = await req.json();

        if (!userId || !orderId || !status) {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }

        const order = await prisma.orders.findFirst({
            where: {
                user_id: userId,
                id: orderId,
            },
        });

        if (!order) {
            return responseHelper({ message: 'No order found', statusCode: 400, data: {} }, 400);
        }

        const currentStatus = order.status;
        const allowedStatusChanges: Record<string, string[]> = {
            [config.order_status.CANCELLED]: [config.order_status.OUT_FOR_DELIVERY, config.order_status.DELIVERED],
            [config.order_status.OUT_FOR_DELIVERY]: [config.order_status.CANCELLED],
            [config.order_status.DELIVERED]: [config.order_status.CANCELLED, config.order_status.OUT_FOR_DELIVERY],
        };

        if (currentStatus && allowedStatusChanges[currentStatus]?.includes(status)) {
            const updatedOrder = await prisma.orders.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: status,
                },
            });

            if (updatedOrder) {
                return responseHelper({ message: 'Order status updated successfully', statusCode: 200, data: {} }, 200);
            }
        }

        return responseHelper({ message: 'Failed to update order status', statusCode: 400, data: {} }, 400);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Order Patch: Internal server error', statusCode: 500, data: {} }, 500);
    }
}


interface OrderItem {
    order_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price_per_unit: number;
    created_at: string;
    updated_at: string;
}
