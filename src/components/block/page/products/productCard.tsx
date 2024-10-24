"use client";
import Image from "next/image";
import { useState } from "react";
import { Card } from "../../../ui/card";
import config from "@/config";
import { Product } from "@/types/client/types";
import { useProductStore } from "@/store/useProductStore";
import useOptimistic from "@/lib/client/hooks/useOptimistic";
import AddSubtract from "./addSubtract";
import { Quantity } from "@/types/client/types";
import VariantModal from "./variantModal";
import { useDevice } from "@/lib/client/hooks/useDevice";

const ProductCard = ({ product }: { product: Product }) => {
  const { cart, updateProductQuantityInCart, updateProductQuantityLocal } =
    useProductStore();
  const { debounceFn } = useOptimistic();
  const quantityInCart = getTotalQuantity();
  const productFromCart = cart.data[product.id] ? cart.data[product.id] : product
  const [showVariant, setShowVariant] = useState<boolean>(false);
  function getTotalQuantity() {
    let total = 0;
    const productExistsInCart = cart.data[product.id];
    if (productExistsInCart) {
      productExistsInCart.quantities.forEach((quantity: Quantity) => {
        total += quantity?.count || 0;
      });
    } else {
      total = 0;
    }
    return total;
  }
  const totalItemsQuantity = getTotalQuantity();
  const productPrice = product.quantities[0].price;
  const updateProductOptimistic = (count: number, quantIndex: number) => {
    const productFromCart = cart.data[product.id] ? cart.data[product.id] : product
    updateProductQuantityLocal(
      productFromCart,
      count,
      product.quantities[quantIndex].id,
    );
    debounceFn(
      () =>
        updateProductQuantityInCart(
          product,
          count,
          product.quantities[quantIndex].id,
        ),
      500,
    );
  };

  const onCountUpdate = (action: "increment" | "decrement", quantIndex:number) => {
    if (product.quantities.length > 1 && !showVariant) {
      setShowVariant(true);
    } else {
      const quantityInCart = cart.data?.[product.id]?.quantities[quantIndex]?.count || 0;
      switch (action) {
        case "increment":
          updateProductOptimistic(quantityInCart + 1, quantIndex);
          break;
        case "decrement":
          updateProductOptimistic(quantityInCart - 1, quantIndex);
          break;
      }
    }
  };

  const updateProductOptimisticV1 = (action: "increment" | "decrement", quantIndex: number, quantObj: Quantity) => {
    onCountUpdate(action, quantIndex);
  };  

  let {isMobile} = useDevice();
  // isMobile = true

  return (
    <Card className="relative flex flex-col border-none shadow-none bg-none w-fit justify-between p-0 gap-2 items-center max-h-[280px] max-w-[200px]">
      <div className="w-fit shadow-sm md:shadow-none border">
        {product.image ? (
          <div className="relative flex items-center justify-center h-full min-w-[90px] min-h-[90px] md:min-w-[170px] md:min-h-[150px]">
            <Image
              src={`${config.directusFileDomain}/${product.image}`}
              alt={product.name}
              style={{
                objectFit: "cover",
              }}
              className="h-full w-full"
              width={180}
              height={250}
            />
          </div>
        ) : (
          <div>Product {product.name} has no image</div>
        )}
      </div>
      <div className=" w-full flex flex-col h-full justify-between px-1">
        <h3 className={`text-xs font-semibold line-clamp-2 md:line-clamp-3 `}>
          {product.name}
        </h3>
        {product.quantities.length > 1 ? (
          <VariantModal
            product={productFromCart}
            isOpen={showVariant}
            onClose={() => setShowVariant(false)}
            onQuantityChange={updateProductOptimisticV1}
          />
        ) : (
          false
        )}
        <div className="flex justify-between items-center w-full mt-1">
          <p className={`text-xs font-semibold ${isMobile ? 'mr-1' : '' }`}>₹{productPrice}</p>
          <AddSubtract count={quantityInCart} onCountUpdate={onCountUpdate} />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
