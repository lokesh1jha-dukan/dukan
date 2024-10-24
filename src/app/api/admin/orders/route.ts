import { responseHelper } from '@/lib/helpers';
import prisma from '@/lib/prisma/client';
import config from '@/config';
import { Prisma } from '@prisma/client';


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const filterStatus = url.searchParams.get("filterStatus");
        const page = Number(url.searchParams.get("page"));
        const ORDER_VALUE_MAPPING: Record<string, string> = {
            "Out for Delivery": "out_for_delivery",
            "Delivered": "delivered",
            "Cancelled": "cancelled",
            "Order Placed": "order_placed",
        }

        const offset = page ? (page - 1) * 10 : 0;
        const filterByStatus = filterStatus ? ORDER_VALUE_MAPPING[filterStatus] : null;


        const orders: any = await prisma.$queryRaw(Prisma.sql`
            SELECT
                o.id,
                o.user_id,
                TO_CHAR(o.order_date, 'DDth Mon YYYY') AS order_date,
                o.total_amount,
                o.status,
                o.created_at,
                o.updated_at,
                json_agg(oi.*) as products
            FROM
                orders o
            LEFT JOIN
                order_items oi ON o.id = oi.order_id
            ${filterByStatus ? Prisma.sql`WHERE o.status =  ${filterByStatus}` : Prisma.empty}
            GROUP BY
                o.id
            ORDER BY
                o.order_date DESC
            LIMIT
                10
            OFFSET
                ${offset};
        `);


        const totalOrders: any = await prisma.$queryRaw(Prisma.sql`
            SELECT
                COUNT(*) as total
            FROM
                orders
            ${filterByStatus ? Prisma.sql`WHERE status = ${filterByStatus}` : Prisma.empty}
            `);


        return responseHelper({ message: 'Orders fetched successfully', statusCode: 200, data: { orders, total: Number(totalOrders[0].total) } }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}


export async function PATCH(req: Request) {
    try {
        const { orderId, status } = await req.json();

        if (!orderId || !status) {
            return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
        }

        const order = await prisma.orders.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return responseHelper({ message: 'Order not found', statusCode: 404, data: {} }, 404);
        }

        const currentStatus: string = order.status as string;

        const notAllowedTransitions: Record<string, string[]> = {
            [config.order_status.CANCELLED]: [config.order_status.OUT_FOR_DELIVERY, config.order_status.DELIVERED],
            [config.order_status.OUT_FOR_DELIVERY]: [config.order_status.CANCELLED],
            [config.order_status.DELIVERED]: [config.order_status.CANCELLED, config.order_status.OUT_FOR_DELIVERY],
        };

        if (notAllowedTransitions[currentStatus]?.includes(status)) {
            return responseHelper({ message: `Invalid status transition from ${currentStatus} to ${status}`, statusCode: 400, data: {} }, 400);
        }

        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: { status },
        });

        return responseHelper({ message: 'Order updated successfully', statusCode: 200, data: updatedOrder }, 200);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

