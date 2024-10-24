import { responseHelper } from '@/lib/helpers';
import { isAuthenticatedAndUserData } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { Cart, CartItem } from '@/types/server/types';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const authData = await isAuthenticatedAndUserData();
     if(!authData.isAuthenticated) {
        const baseUrl = new URL(req.url).origin
        return NextResponse.redirect(new URL("/auth/login", baseUrl));
    }
    const user_id = authData.user?.id
    // let user_id = 5; // Sample user_id, replace it with actual user_id logic
    
    const cartItems: CartItem[] = await prisma.$queryRaw`
            SELECT 
            c.id as cart_id, 
            c.cart_quantity,
            c.created_at, 
            c.updated_at, 
            p.name, 
            p.description, 
            p.image, 
            p.category_id, 
            q.id as quantity_id, 
            q.price,
            q.product_id, 
            q.quantity, 
            q.price as quantity_price, 
            q.is_stock_available, 
            q.stocked_quantity 
        FROM 
            cart as c
        JOIN 
            products as p ON c.product_id = p.id
        JOIN 
            quantity as q ON c.quantity_id = q.id
        WHERE 
            user_id = ${user_id};
    `;

    return responseHelper(
      {
        message: "Cart items fetched successfully",
        statusCode: 200,
        data: cartItems,
      },
      200,
    );

  } catch (error) {
    console.log(error);
    return responseHelper({ message: "Internal Server Error", statusCode: 500, data: {} }, 500);
  }
}

export async function POST(req: Request) { 
  try {
    const { productId, quantityId, quantity } = await req.json();
    const authData = await isAuthenticatedAndUserData();
    if(!authData.isAuthenticated || !authData.user) {
        return responseHelper({ message: 'User not authenticated', statusCode: 401, data: {} }, 401);
    }
    const userId = authData?.user?.id;
  
    if (quantity === undefined) {
      return responseHelper(
        {
          message: "Please provide Product id and Quantity id",
          statusCode: 400,
          data: {},
        },
        200,
      );
    }
    const cart_quantity: number = isNaN(Number(quantity))? 1 :  Number(quantity);
    
    let cartItem = await prisma.cart.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
        quantity_id: quantityId,
      },
    });
    console.log(cartItem)
    let apimessage = '';
    let response: any = {};
    if (quantity == 0 && cartItem) {
      // If quantity is 0, remove the item from the cart
      response = await prisma.$queryRaw`DELETE FROM cart WHERE id = ${cartItem.id}`

      apimessage = 'Product removed from cart';
    } else if (cartItem && quantity) {
      response = await prisma.$queryRaw`UPDATE cart SET cart_quantity = ${cart_quantity} WHERE id = ${cartItem.id}`

      apimessage = 'Product count updated';
    } else if (productId && userId) {
      // Add a new product to the cart
      response = await prisma.$queryRaw`INSERT INTO cart (user_id, product_id, quantity_id, cart_quantity) VALUES (${userId}, ${productId}, ${quantityId}, ${cart_quantity})`
      apimessage = 'New product added to cart';
    }

    if (apimessage === '') {
      return responseHelper(
        { message: "Failed to update cart", statusCode: 400, data: {} },
        200,
      );
    }

    return responseHelper(
      { message: apimessage, statusCode: 200, data: response },
      200,
    );
  } catch (error) {
    console.log(error);
    return responseHelper(
      { message: "CART::POST Internal Server Error", statusCode: 500, data: {} },
      500,
    );
  }
}
