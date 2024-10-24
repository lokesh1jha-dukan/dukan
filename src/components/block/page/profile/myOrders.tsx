"use client"
import { useEffect, useState } from "react"
import OrderModal from "./orderModal"
import { Order } from "@/types/client/types"
import { fetchInsideTryCatch } from "@/lib/client/apiUtil"

type Props = {

}

const MyOrders = (props: Props) => {
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        getOrders();
    }, [])


    const getOrders = async () => {
        console.log("get orders")
        const orders = await fetchInsideTryCatch("api/profile/order")
        const data = orders && orders.response.data ? orders.response.data as Order[] : []
        if (data) {
            setOrders(data)
        }
    }

    return (
        <>
            <div className="flex gap-4">
                Orders
            </div>
            <OrderModal
                orders={orders}
                getOrders={getOrders}
            />
        </>
    )
}

export default MyOrders