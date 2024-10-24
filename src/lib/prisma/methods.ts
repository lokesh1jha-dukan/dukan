'use server'
import { Cart, CartItemQuantity, Product } from "@/types/client/types";
import prisma from "./client";
import { isAuthenticatedAndUserData } from "../auth";
import { CartItem } from "@/types/client/types";

export const getProductsByCategoryId = async (category_id: number) => {
    const data: Product[] = await prisma.$queryRaw`
    SELECT
      p.*,
      json_agg(q.*) as quantities
    FROM
      products p
    LEFT JOIN
      quantity q
    ON
      p.id = q.product_id
    WHERE
      p.category_id = ${category_id}
    GROUP BY
      p.id
  `;
    // console.log(data, "data")
    return data
}

export const getCartData = async (): Promise<CartItem[]> => {
  const auth = await isAuthenticatedAndUserData()
  if(auth.isAuthenticated) {
    const user_id = auth?.user?.id
    return await prisma.$queryRaw`
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
  }
  return [];
}

