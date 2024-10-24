"use client"
import Categories from "@/components/block/page/products/categories";
import { getCategories } from "@/lib/directus/methods";

type Props = {}

export  default async function Page({}: Props) {
  const categories = await getCategories()

  
  return (
    <div className="flex flex-col gap-8">
      <Categories
        categories={categories}
      />
    </div>
  )
}

