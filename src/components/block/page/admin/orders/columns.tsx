"use client"

import { AdminDashboardOrders } from "@/types/client/types"
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<AdminDashboardOrders>[] = [
  {
    accessorKey: "order_date",
    header: "Order Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
  },
  {
    accessorKey: "products",
    header: "Products",
  }
]
