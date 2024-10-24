"use client";
import config from "@/config";
import { CartItem, Product } from "@/types/client/types";
import Image from "next/image";
import React from "react";
import AddSubtract from "../products/addSubtract";
import { useProductStore } from "@/store/useProductStore";
import useOptimistic from "@/lib/client/hooks/useOptimistic";


type CartProductType = {
    cart_id: number;
    cart_quantity: number;
    created_at: Date;
    updated_at?: Date | null;
    name: string;
    description: string;
    image: string;
    category_id: number;
    quantity_id: number;
    price: string;
    product_id: number;
    quantity: string;
    quantity_price: string;
    is_stock_available: number;
    stocked_quantity: number;
};


type Props = {
    item: any
    // Omit<CartProductType,
    //     "cart_id" |
    //     "cart_quantity" |
    //     "quantity_price" |
    //     "stocked_quantity"
    // > & {
    //     count: number;
    //     quantity_id?: number;
    // }
    product: Product;
    index: number;
};
const CartProduct = (props: Props) => {
    const { updateProductQuantityInCart, updateProductQuantityLocal } =
        useProductStore();
    const { debounceFn } = useOptimistic();

    const updateProductOptimistic = (count: number, variantId: number) => {
        updateProductQuantityLocal(props.product, count, variantId);
        debounceFn(
            () => updateProductQuantityInCart(props.product, count, variantId),
            500,
        );
    };

    const onCountUpdate = (action: "increment" | "decrement") => {
        const count = props.product.quantities[props.index]?.count || 0;
        const variantId = props.product.quantities[props.index]?.id || 0;
        switch (action) {
            case "increment":
                updateProductOptimistic(count + 1, variantId);
                break;
            case "decrement":
                updateProductOptimistic(count - 1, variantId);
                break;
        }
    };


    return (
        <div
            className="flex items-center justify-between">
            <div className="flex">
                <Image
                    src={`${config.directusFileDomain}/${props.item.image}`}
                    alt={props.item.name}
                    width={70}
                    height={70}
                    className="border border-slate-200 rounded-md object-contain max-w-[70px] max-h-[70px]"
                />
                <div className="flex flex-col ml-2 basis-2/3">
                    <p className="text-slate-800 mb-0 text-xs line-clamp-2">{props.item.name}</p>
                    <p className="text-slate-600 text-xs">{props.item.quantity}</p>
                    <p className="font-medium text-slate-900 text-xs">
                        ₹{props.item.price}
                    </p>
                </div>
            </div>
            <AddSubtract count={props.item.count} onCountUpdate={onCountUpdate} />
        </div>
    );
};

export default CartProduct;
