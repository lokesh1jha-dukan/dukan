"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Order } from "@/types/client/types"
import { useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableCaption, TableHead } from "@/components/ui/table"
import { fetchInsideTryCatch } from "@/lib/client/apiUtil"
import { useDevice } from "@/lib/client/hooks/useDevice"

type Props = {
    orders: Order[];
    getOrders: () => void;
}
const OrderModal = (props: Props) => {
    const [open, setOpen] = useState(false)
    const [showOrderDetails, setShowOrderDetails] = useState<Order | null>(null)
    const [cancelPopup, setCancelPopup] = useState(false)
    const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null)
    const { orders } = props
    const { isMobile } = useDevice()
    const handleViewDetails = (order: Order) => {
        console.log(order)
        setShowOrderDetails(order)
        setOpen(true)
    }

    const OrderStatus = {
        "order_placed": "Order Placed",
        "out_for_delivery": "Out for Delivery",
        "cancelled": "Cancelled",
        "delivered": "Delivered"
    }

    const handleCancelOrder = async () => {
        const response = await fetchInsideTryCatch(`/api/admin/orders`,
            {
                method: "PATCH",
                body: JSON.stringify({ orderId: deleteOrderId, status: "cancelled" })
            }
        )
        setCancelPopup(false)
        setOpen(false)
        if (response && response.response && response.response.statusCode === 200) {
            console.log("Order cancelled")
            props.getOrders()
        }

    }
    return (
        <>
            <div className="w-full">
                <Table className="w-full overflow-x-auto">
                    <TableCaption>Order Items</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{isMobile ? "Date" : "Order Date"}</TableHead>
                            <TableHead>{isMobile ? "Amount" : "Total Amount"}</TableHead>
                            <TableHead>{isMobile ? "Status" : "Order Status"}</TableHead>
                            {!isMobile && <TableHead>Action</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} onClick={() => handleViewDetails(order)}>
                                <TableCell>{new Date(order.created_at).toDateString()}</TableCell>
                                <TableCell>Rs. {order.total_amount}</TableCell>
                                <TableCell>{OrderStatus[order.status]}</TableCell>
                                {!isMobile && <TableCell>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            handleViewDetails(order)
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            {
                open && showOrderDetails &&
                <Dialog open={open} onOpenChange={() => setOpen(false)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                                <div className="flex flex-col gap-4">
                                    {/* Show Order Details */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Order Date</span>
                                            <span className="text-sm">{new Date(showOrderDetails.order_date).toDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Order Amount</span>
                                            <span className="text-sm">{showOrderDetails.total_amount}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Order Status</span>
                                            <span className="text-sm">{OrderStatus[showOrderDetails.status]}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Order items </span>
                                            <div className="flex flex-col gap-2">
                                                <div className="w-full">
                                                    <Table className="table-fixed">
                                                        <TableCaption>Order Items</TableCaption>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Product Name</TableHead>
                                                                <TableHead>Quantity</TableHead>
                                                                <TableHead>Price Per Unit</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {showOrderDetails.order_items.map((item) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell>{item.product_name}</TableCell>
                                                                    <TableCell>{item.quantity}</TableCell>
                                                                    <TableCell>{item.price_per_unit}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Cancel button if order_date is not older than 5 hours */}
                                        {new Date(showOrderDetails.order_date).getTime() > new Date().getTime() - 5 * 60 * 60 * 1000 && showOrderDetails.status === "order_placed" &&
                                            <div className="flex items-center justify-between">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => { setDeleteOrderId(Number(showOrderDetails.id)); setCancelPopup(true) }}
                                                >
                                                    Calcel Order
                                                </Button>
                                            </div>
                                        }
                                        {
                                            cancelPopup &&
                                            <Dialog open={cancelPopup} onOpenChange={setCancelPopup}>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Address</DialogTitle>
                                                        <DialogDescription>
                                                            <p>Are you sure you want to delete this address?</p>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex justify-end gap-4">
                                                        <Button color="secondary" onClick={() => setCancelPopup(false)}>Cancel</Button>
                                                        <Button onClick={handleCancelOrder}>Yes</Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        }
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog >
            }
        </>
    )
}




export default OrderModal