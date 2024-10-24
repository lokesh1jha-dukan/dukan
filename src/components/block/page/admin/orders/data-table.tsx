"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { AdminDashboardOrders } from "@/types/client/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchInsideTryCatch } from "@/lib/client/apiUtil";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


interface DataTableProps {
  data: AdminDashboardOrders[];
  getData: (filterStatus: string) => void;
  setPage: (page: number) => void;
  totalPages: number;
}

export function DataTable({ data, getData, setPage, totalPages }: DataTableProps) {
  const DELIVERY_STATUS_LABEL = "Select Delivery Status";

  const [popupData, setPopupData] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(DELIVERY_STATUS_LABEL);
  const [filterByStatus, setFilterByStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  type DeliveryStatus = 'Out for Delivery' | 'Delivered';
  const DELIVERY_STATUS_KEY_VALUE: Record<string, string> = {
    "Out for Delivery": "out_for_delivery",
    "Delivered": "delivered",
  }
  const ORDER_STATUS_VALUE_KEY: Record<string, string> = {
    "order_placed": "Order Placed",
    "out_for_delivery": "Out for Delivery",
    "delivered": "Delivered",
    "cancelled": "Cancelled",
  }

  const handleValueChange = (newValue: DeliveryStatus) => {
    setDeliveryStatus(newValue);
  };


  const handleViewDetails = (order: AdminDashboardOrders) => {
    const orderKeyValue: any[] = order.products.map((item: any, index: number) => {
      item.total_amount = Number(item.price_per_unit) * Number(item.quantity);
      const keys = ["product_name", "price_per_unit", "product_quantity", "quantity", "total_amount"];
      const filteredData = Object.fromEntries(Object.entries(item).filter(([key]) => keys.includes(key)));

      return { id: `${item.order_id}_${index}`, data: filteredData };
    });
    console.log(orderKeyValue, "orderKeyValue");

    setPopupData(orderKeyValue);
    setShowPopup(true);

  };

  const handleUpdateDelivery = async () => {
    console.log(deliveryStatus, popupData[0].id.split("_")[0], "deliveryStatus")
    const response = await fetchInsideTryCatch(`/api/admin/orders`, {
      method: "PATCH",
      body: JSON.stringify({
        orderId: Number(popupData[0].id.split("_")[0]),
        status: DELIVERY_STATUS_KEY_VALUE[deliveryStatus],
      }),
    })

    if (response && response.response && response.response.statusCode === 200) {
      console.log("Order status updated")
    } else {
      console.log("Order status not updated")
    }
    getData(filterByStatus);
    setShowPopup(false);
    setDeliveryStatus(DELIVERY_STATUS_LABEL);
  };

  const handleFilterChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const orderStatus = event.target.value;
    setFilterByStatus(orderStatus);
    getData(orderStatus);
  };

  const handlePageChange = (page: number) => {
    if(page < 1 || page > totalPages) return
    setCurrentPage(page);
    setPage(page);
  };

  return (
    <>
      <div className="flex col-2">
        <div className="w-1/2">
        <label htmlFor="orderStatusFilter">Filter by Order Status:</label>
        <select className="text-black bg-white ml-2 h-6 w-1/2" id="orderStatusFilter" onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Order Placed">Order Placed</option>
        </select>
        </div>
        <div className="w-1/2 ml-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="text-white">
            <TableRow >
              <TableHead className="text-white">Ordered On</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold">Total amount</TableHead>
              <TableHead className="text-white font-bold">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{new Date(order.created_at).toDateString()}</TableCell>
                <TableCell>{ORDER_STATUS_VALUE_KEY[order.status]}</TableCell>
                <TableCell>Rs. {order.total_amount}</TableCell>
                <TableCell>
                  <Button
                    className="color=primary"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>


        {/* Popup window */}
        {showPopup && (
          <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ordered Item List</DialogTitle>
                <DialogDescription>
                  <p>Update the delivery Status by using the below dropdown</p>
                </DialogDescription>
              </DialogHeader>

              <h2 className="text-lg font-bold mb-4 text-black"></h2>
              <div className="container mx-auto py-10">
                <Table className="text-black">
                  <TableCaption>Data Table</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="font-semibold pr-2">Product Name</TableCell>
                      <TableCell className="font-semibold pr-2">Price per Unit</TableCell>
                      <TableCell className="font-semibold pr-2">Product Quantity</TableCell>
                      <TableCell className="font-semibold pr-2">Quantity</TableCell>
                      <TableCell className="font-semibold pr-2">Total</TableCell>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popupData.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300">{item.data.product_name}</td>
                        <td className="border border-gray-300">{item.data.price_per_unit}</td>
                        <td className="border border-gray-300">{item.data.product_quantity}</td>
                        <td className="border border-gray-300">{item.data.quantity}</td>
                        <td className="border border-gray-300">{item.data.total_amount}</td>
                      </tr>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <tr>
                      <td colSpan={4} className="border border-gray-300 font-semibold pr-2">
                        Total Amount:
                      </td>
                      <td className="border border-gray-300 font-semibold pr-2">
                        {popupData.reduce(
                          (total, item) =>
                            total + item.data.price_per_unit * item.data.quantity,
                          0
                        )}
                      </td>
                    </tr>
                  </TableFooter>
                </Table>
              </div>

              {/* Dropdown to select delivery status */}
              <div className="mt-4">
                <label htmlFor="deliveryStatus" className="block font-semibold">
                  Delivery Status:
                </label>
                <Select value={deliveryStatus} onValueChange={handleValueChange}>
                  <SelectTrigger className="bg-gray-200 rounded-md flex px-3 py-2 text-black">
                    <span className="font-semibold pr-2">{deliveryStatus}</span>
                    <ChevronDown className="h-6 w-4 text-black-400" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="bg-yellow-200 w-[170px] border border-black-300" value="Out for Delivery">Out for Delivery</SelectItem>
                    <SelectItem className="bg-green-200 w-[170px] border border-black-300" value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>

              </div>
              <div className="flex justify-end mt-4">
                <Button
                  color="primary"
                  onClick={handleUpdateDelivery}
                  disabled={deliveryStatus === DELIVERY_STATUS_LABEL} // Disable button if delivery status is not selected
                >
                  Update Delivery Status
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )
        }
      </div >
    </>
  );
}


