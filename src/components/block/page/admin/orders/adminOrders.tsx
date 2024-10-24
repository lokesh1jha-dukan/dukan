"use client";
import { fetchInsideTryCatch } from "@/lib/client/apiUtil";
import { AdminDashboardOrders } from "@/types/client/types";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";



export default function AdminOrders() {

  const [data, setData] = useState<AdminDashboardOrders[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  async function getData(filterStatus: string): Promise<AdminDashboardOrders[]> {
    // Fetch data from your API here.
    const response = await fetchInsideTryCatch<any>(
      `api/admin/orders?filterStatus=${filterStatus}&page=${page}`
    );
  
    if (response && response.response.statusCode === 200 && response.response.data) {
      setData(response.response.data.orders);
      setTotalPages(response.response.data.totalPages);
    }
    return [];
  }

  useEffect(() => {
    getData("All")
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable getData={getData} data={data} setPage={setPage} totalPages={totalPages}/>
    </div>
  )
}
