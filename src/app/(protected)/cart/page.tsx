import OrderCart from "@/components/block/page/cart/cart";
import { getCartData } from "@/lib/prisma";
import React from "react";
import { IoMdClose } from "react-icons/io";


  
type Props = {};
export default async function Page({}: Props) {
    const data = await getCartData()
    
    return (
        <div className="m-auto grid grid-cols-1">
            <div className="col-span-1 py-4 border-b border-slate-200 shadow-sm">
                <div className="flex justify-between items-center container">
                    <p className="font-semibold">My Cart</p>
                    <IoMdClose className="w-4 h-4" />
                </div>
            </div>
            <div className="container">
                <div className="col-span-1 mt-2 px-2 py-3 rounded-lg bg-blue-200 text-blue-600">
                    Store is open
                </div>
                <div className="col-span-1">
                    <OrderCart cartData={data} />
                </div>
            </div>
        </div>
    );
}
