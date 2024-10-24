"use client"
import { useProductStore } from '@/store/useProductStore'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import OrderCart from '@/components/block/page/cart/cart'


type Props = {
    children: React.ReactNode
}

const Template = (props: Props) => {
    const { isCartSheetVisible, toggleCartSheet } = useProductStore()

    return (
        <>
            <Sheet open={isCartSheetVisible} onOpenChange={() => toggleCartSheet(false)} >
                <SheetContent className='px-0 py-4 w-[500px] sm:max-w-[540px]'>
                    <SheetHeader className=''>
                        <SheetTitle className='border-b border-slate-200 shadow-sm px-2 pb-4'>
                            <p className="font-semibold text-sm">My Cart</p>
                        </SheetTitle>
                    </SheetHeader>
                    <SheetDescription className='lg:max-w-screen-lg overflow-y-scroll max-h-[calc(100vh_-_136px)]'>
                        <OrderCart />
                    </SheetDescription>
                </SheetContent>
            </Sheet>
            {props.children}
        </>
    )
}

export default Template