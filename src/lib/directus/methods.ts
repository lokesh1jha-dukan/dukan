"use server";
import { Category, Product } from "@/types/client/types";
import { isAuthenticatedAndUserData } from "../auth";
import { directus } from "../utils";
import { readItems } from "@directus/sdk";
import prisma from "../prisma/client";

interface CartItemType {
  cart_id: number;
  cart_quantity: number;
  quantity_id: number;
  name: string;
  description: string;
  category_id: number;
  image: string;
  quantity: number;
  price: number;
  is_stock_available: boolean;
  created_at: Date;
  updated_at: Date;
}

const getCartItems = async (): Promise<CartItemType[]> => {
  const auth = await isAuthenticatedAndUserData();
  if (auth.isAuthenticated && auth.user) {
    const userId = auth.user.id;

    const cartItems: CartItemType[] = await prisma.$queryRaw`
      SELECT c.id as "cart_id", c.cart_quantity, c.quantity_id, 
      p.name, p.description, p.category_id, p.image,
      q.quantity, q.price, q.is_stock_available,
      c.created_at, c.updated_at
      FROM cart c
      JOIN products p ON c.product_id = p.id
      JOIN quantity q ON c.quantity_id = q.id
      WHERE c.user_id = ${userId}
    `;

    return cartItems;
  } else {
    return []; 
  }
};



const getCategories = async (): Promise<Category[]> => {
  const data: Category[] = await directus.request(
    // @ts-expect-error
    readItems("categories", { fields: ["id", "name"] }),
  );

  return data;
};

const getProductsByCategoryId = async (
  categoryId: string,
): Promise<Product[]> => {
  const category_id = Number(categoryId)
  const products: Product[] =  await prisma.$queryRaw`
  SELECT p.*, json_agg(q.*) as quantities, count(q.*)
  FROM products p
  LEFT JOIN quantity q ON p.id = q.product_id
  WHERE p.category_id = ${category_id}
  GROUP BY p.id`;

  return products;
};



export { getCartItems, getCategories, getProductsByCategoryId };
