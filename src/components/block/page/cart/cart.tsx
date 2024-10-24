"use client"

import { useProductStore } from '@/store/useProductStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CartItems from './cartItems'
import { ArrowRightIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import BillDetails from './billDetails'
import { CartItem, Quantity } from '@/types/client/types'
import { formatCartData } from '@/lib/client/helpers'

type Props = {
    cartData?: CartItem[]
}

function OrderCart(props: Props) {
    const { cart, updateCart, toggleCartSheet } = useProductStore()
    const totalAmount = getTotalPrice()
    const router = useRouter()

    const handleProceedAction = () => {
        toggleCartSheet(false)
        router.push('/cart')
    }

    function getTotalPrice(): number {
        let total: number = 0;
        Object.values(cart.data).forEach((product) => {
            product.quantities.forEach((quantity: Quantity) => {
                total += Number(quantity.price) * Number(quantity.count);
            })
        })
        return Number(total.toFixed(2))
    }

    useEffect(() => {
        if (props.cartData) {
            const cart = formatCartData(props.cartData)
            updateCart(cart)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.cartData])

    const gotoPaymentPage = () => {
        console.log("gotoPaymentPage")
        router.push('/payment')
    }

    //TODO: take value from env
    let deliveryCharge = 100
    if (totalAmount > 500) {
        deliveryCharge = 0
    }

    return (
        <>
            {
                Object.keys(cart).length ?
                    <div className=''>
                        <div className='px-2'>
                            <CartItems cartData={cart.data} />
                        </div>
                        <div className='px-2 mt-4'>
                            <BillDetails subTotal={totalAmount} deliveryCharge={deliveryCharge} grandTotal={totalAmount + deliveryCharge} />
                        </div>
                        <Card className='px-2 py-2 mx-2 mt-2'>
                            <p>Cancellation Policy</p>
                            <p className='text-xs text-slate-500 mt-1'>Cancellation charges may be applicable</p>
                        </Card>
                        <div className='fixed bottom-0 right-0 left-0 py-4 bg-white border-t border-slate-200 rounded-tl-xl shadow-[0_0_10px_0px_rgba(0,0,0,0.1)] rounded-tr-lg'
                        onClick={gotoPaymentPage}>
                            <div className='mr-4 ml-4 p-2 rounded-md bg-primary flex text-white cursor-pointer justify-between items-center' onClick={handleProceedAction}>
                                <div className='text-xs'>
                                    <p className='font-medium'> ₹{totalAmount}</p>
                                    <p className='font-light  uppercase tracking-wide'>Total</p>
                                </div>
                                <div
                                    className='flex items-center gap-1'
                                    >
                                    <p>Proceed</p>
                                    <ArrowRightIcon />
                                </div>
                            </div>
                        </div>

                    </div>
                    : false
            }
        </>
    )
}

export default OrderCart