import { Card } from '@/components/ui/card'
import { CiDeliveryTruck } from "react-icons/ci";
import { CiDiscount1 } from "react-icons/ci";
import { RxFileText } from "react-icons/rx";
import React from 'react'

type Props = {
  subTotal: number,
  grandTotal: number
  discountAmount?: number
  deliveryCharge?: number,
}

function BillDetails(props: Props) {
  const { subTotal, grandTotal, discountAmount, deliveryCharge } = props
  return (
    <Card className='flex flex-col p-2'>
      <div className='font-medium'>Bill Details</div>
      <div className='bill-breakup'>
        <div className='flex flex-col justify-between items-center text-xs leading-relaxed tracking-normal'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center text-xs gap-1'>
              <RxFileText size={12} />
              <span>Sub total</span>
            </div>
            <div>
              <span className='font-medium'>₹{subTotal}</span>
            </div>
          </div>
          {(deliveryCharge && deliveryCharge >= 0) && 
          <div className='flex justify-between items-center w-full'>
            <div className='flex justify-center items-center gap-1'>
            <CiDeliveryTruck size={12} />
            <span>Delivery Charge</span>
            </div>
            <span className='font-medium'>₹{deliveryCharge}</span>
          </div>}
          {(discountAmount && discountAmount > 0) && <div className='flex justify-between items-center w-full'>
            <div className='flex items-center gap-1'>
            <CiDiscount1 size={12} />
            <span>Discount</span>
            </div>
            <span className='font-medium'>₹{discountAmount}</span>
          </div>}
          <div className='flex justify-between items-center w-full mt-2'>
            <span className='font-bold tracking-wide'>Grand Total</span>
            <span className='font-medium'>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default BillDetails