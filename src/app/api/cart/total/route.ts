import { responseHelper } from '@/lib/helpers';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/client';


export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const authData = await isAuthenticatedAndUserData();
     if(!authData.isAuthenticated) {
        return responseHelper({ message: "User not authenticated", statusCode: 401, data: {} }, 401);
    }
    const user_id = authData.user?.id
    
    const cartItemSum: any[] = await prisma.$queryRaw`
    SELECT c."cart_quantity", q."price"
    FROM "cart" AS c
    JOIN "quantity" AS q ON q.id = c.quantity_id
    WHERE c."user_id" = ${user_id}
    `;
    let sum = 0
    cartItemSum.forEach((item) => {
      sum += Number(item.price) * Number(item.cart_quantity)
    })
    if(isNaN(sum)) {
        return responseHelper({ message: "Something went wrong", statusCode: 200, data: {} }, 200);
    }
    return responseHelper(
      {
        message: "Cart Total fetched successfully",
        statusCode: 200,
        data: {totalCartSum: sum},
      },
      200,
    );

  } catch (error) {
    console.log(error);
    return responseHelper({ message: "Internal Server Error", statusCode: 500, data: {} }, 500);
  }
}