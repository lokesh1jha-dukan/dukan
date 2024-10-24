"use client";
import { Card } from "@/components/ui/card";
import { Cart, Quantity } from "@/types/client/types";
import { useProductStore } from "@/store/useProductStore";
import CartProduct from "./cartItem";
import { useEffect } from "react";
import { CartItem, Product } from "@/types/client/types";

type Props = {
    cartData: Cart
};

function CartItems(props: Props) {
    const { cart, updateCart } = useProductStore()
    useEffect(() => {
        updateCart(props.cartData)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.cartData])

    return (
        <Card className="flex flex-col gap-4 px-2 py-2 mt-4">
            {
                Object.values(cart.data).map((item: Product) => (
                    <>
                        {
                            item.quantities.map((quant: Quantity, index) => {
                                const updatedItem = {
                                    ...item,
                                    ...quant,
                                    created_at: item.created_at ? new Date(item.created_at): new Date(), 
                                    updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
                                };
                                return (
                                    <CartProduct key={index} item={updatedItem} product={item} index={index} />
                                );
                            })
                        }
                    </>
                ))
            }
        </Card>
    );
}

export default CartItems;

