import { Cart, CartItem, CartItemQuantity } from "@/types/client/types";

export function formatCartData(apiData: CartItem[]): Cart {
    const formattedCart: Cart = {} as Cart;
    
    apiData.forEach((item, index) => {
        const {
        product_id,
        name,
        description,
        category_id,
        created_at,
        updated_at,
        image,
        quantity_id,
        quantity,
        price,
        is_stock_available,
        stocked_quantity,
        cart_quantity,
        cart_id,
      } = item;
      // const quantity = apiData
      if (!formattedCart[product_id]) {
        formattedCart[product_id] = {
          id: product_id,
          name,
          description,
          category_id,
          created_at,
          updated_at,
          image,
          quantities: [],
        };
      }
    
      const cartItemQuantity: CartItemQuantity = {
        id: quantity_id as number,
        cart_id,
        product_id,
        quantity,
        price,
        is_stock_available,
        count: cart_quantity,
        stocked_quantity: stocked_quantity,
        created_at,
        updated_at: updated_at || '',
        added_quantity: cart_quantity,
      };
      
  
      formattedCart[product_id].quantities.push(cartItemQuantity);
    });
    return formattedCart;
  }
