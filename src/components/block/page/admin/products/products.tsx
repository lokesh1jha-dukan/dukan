"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchInsideTryCatch } from "@/lib/client/apiUtil";
import { Category, NewProduct, Product, ResponseObject } from "@/types/client/types";
import AdminProductCard from "./adminProductCard";
import { getProductsByCategoryId } from "@/lib/prisma";
import { getCategories } from "@/lib/directus/methods";
import AddProductModal from "./addProduct";
import AddCategoryModal from "./addCategory";

const sampleProduct: Product = {
  id: 1,
  name: "Sample Product",
  description: "This is a sample product",
  image: "https://via.placeholder.com/150",
  category_id: 1,
  quantities: [
    // {
    //   id: 1,
    //   product_id: 1,
    //   quantity: "10 gram",
    //   is_stock_available: 1,
    //   price: "10",
    //   stocked_quantity: 1
    // }
  ]
}

const ProductsComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [addProductShow, setAddProductShow] = useState(false);
  const [addNewCategoryShow, setAddNewCategoryShow] = useState(false);
  const [loadEditingProduct, setLoadEditingProduct] = useState<Product>(sampleProduct);


  const fetchAllProducts = async () => {
    try {
      const response = await fetchInsideTryCatch<Product[]>(
        `api/admin/products`
      );

      if (response && response.response.data) {
        setProducts(response.response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCategoryWithId = async () => {
    const result = await getCategories();
    setCategoryList(result);
  }

  const handleCategoryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    console.log(id);
    if (id === "") {
      fetchAllProducts();
      return;
    }
    const result = await getProductsByCategoryId(Number(id))
    setProducts(result);

    setSelectedCategory(event.target.value);
  };

  const addNewProduct = async (product: NewProduct) => {
    console.log("Add new product", product);
    setAddProductShow(!addProductShow);

    // TODO: Add new product
    // TODO: Add quantites
    
  //   let response = await fetch("/api/admin/product", {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ product })
  // })


  }

  const addNewCategory = async (newCategory: string) => {
    console.log("Add new category", newCategory);
    let response = await fetch("/api/admin/category", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newCategory })
    })
    const data: ResponseObject = await response.json()
    console.log(data)
  }

  const openNewCategoryDialog = () => {
    setAddNewCategoryShow(true);
  }
  useEffect(() => {
    fetchAllProducts();
    getCategoryWithId();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button color="primary" style={{ marginRight: '0.5rem', marginTop: '0.5rem' }}
          onClick={() => setAddProductShow(!addProductShow)}>
          Add New Product
        </Button>
        <Button color="primary" onClick={openNewCategoryDialog} style={{ marginTop: '0.5rem' }}>
          Add New Category
        </Button>
      </div>
      {/* Filter by category */}
      <div className="mb-4">
        <label htmlFor="categorySelect" className="mr-2">Filter by category:</label>
        <select id="categorySelect" style={{ color: 'black' }} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categoryList.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      {
        addProductShow &&
        <AddProductModal
          categoryList={categoryList}
          product={loadEditingProduct}
          isOpen={addProductShow}
          onClose={() => setAddProductShow(false)}
          onsubmit={(product) =>addNewProduct(product)}
        />
      }

      {
        addNewCategoryShow &&
        <AddCategoryModal
          isOpen={addNewCategoryShow}
          onClose={() => setAddNewCategoryShow(false)}
          onSubmit={addNewCategory}
        />
      }
      <div style={{ height: '800px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', padding: '8px' }}>
          {products.map((product, index) => (
            <AdminProductCard key={index} product={product} categoryList={categoryList} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsComponent;
