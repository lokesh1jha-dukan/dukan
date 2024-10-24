"use client";

import React, { useState, useEffect } from "react";
import { Category, NewProduct, Product, Quantity, QuantityInAddProduct } from "@/types/client/types";
import SingleFileUploader from "@/components/ui/SingleVideoUploader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";



type Props = {
  categoryList: Category[];
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onsubmit: (product: NewProduct) => void;
};



const AddProductModal = (props: Props) => {
  const [productName, setProductName] = useState(props.product.name || "");
  const [productDiscription, setProductDiscription] = useState(props.product.description || "");
  const [quantities, setQuantities] = useState<QuantityInAddProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [imageUUID, setImageUUID] = useState<string>("");

  useEffect(() => {
    props.product.quantities.forEach((quantity: Quantity) => {
      setQuantities(prevQuantities => [
        ...prevQuantities,
        { id: quantity.id, product_id: quantity.product_id, quantity: quantity.quantity, price: quantity.price, stocked_quantity: String(quantity.stocked_quantity) }
      ]);
    });
  }, []);


  // Function to get category ID from category name
  const getCategoryIdFromName = (categoryName: string) => {
    const foundCategory = props.categoryList.find(category => category.name === categoryName);
    return foundCategory ? foundCategory.id : null;
  };

  // Function to handle select value change
  const handleSelectChange = (value: string) => {
    setSelectedCategory(value);
    const categoryId = getCategoryIdFromName(value);
    console.log("Selected category ID:", categoryId);
  };


  const filteredCategories = props.categoryList.filter(category =>
    category.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleUpload = async (imageUUID: string) => {
    setImageUUID(imageUUID);
  };

  const handleAddQuantity = () => {
    setQuantities([...quantities, { quantity: "", price: "", stocked_quantity: "" }]);
  };

  const handleQuantityChange = (index: number, field: keyof QuantityInAddProduct, value: string) => {
    const updatedQuantities = [...quantities];
    (updatedQuantities[index][field] as string) = value;
    setQuantities(updatedQuantities);
  };

  const handleSubmit = () => {
    console.log("Product Name:", productName);
    console.log("Image UUID:", imageUUID);
    console.log("Quantities:", quantities);
    const returnObject = {
      name: productName,
      description: productDiscription,
      image: imageUUID,
      category_id: selectedCategory,
      quantities: quantities,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    props.onsubmit(returnObject);
  };


  if (!props.isOpen) {
    return null; // Render nothing if modal is not open
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-75">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:max-w-md">
            <div className="py-4 px-6 text-black">
              <div className="border-b border-slate-200 pb-4">
                <label className="font-semibold text-lg mb-2">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="font-semibold text-lg mb-2">Description</label>
                <input
                  type="text"
                  value={productDiscription}
                  onChange={(e) => setProductDiscription(e.target.value)}
                  placeholder="Description"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full" />
              </div>
              <div className="mt-4">
                <label className="font-semibold text-lg mb-2">Image Upload</label>
                <SingleFileUploader onUpload={handleUpload} />
              </div>
              <div className="mt-4">
                <label className="font-semibold text-lg mb-2">Select Category</label>
                <Select value={selectedCategory} onValueChange={handleSelectChange}>
                  <SelectTrigger
                    className="bg-gray-200 rounded-md flex items-center justify-between px-3 py-2 text-black"
                    style={{ minWidth: "8rem" }}
                  >
                    <span className="font-semibold pr-2">{selectedCategory ? selectedCategory : "Select Category"}</span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </SelectTrigger>
                  <SelectContent className="mt-2" style={{ backgroundColor: "#fff", borderRadius: "4px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search category..."
                      className="border border-gray-300 rounded-md px-3 py-2 mb-2"
                      style={{ width: "100%", boxSizing: "border-box" }}
                    />
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4">

                <table className="border border-gray-300 rounded-md w-full mt-4">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-3 py-2">Quantity</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Stock Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quantities.map((quantity, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-3 py-2">
                          <input
                            type="text"
                            value={quantity.quantity}
                            onChange={(e) => handleQuantityChange(index, "quantity", e.target.value)}
                            placeholder="Quantity"
                            className="w-full outline-none"
                          />
                          <span className="text-gray-500 text-sm mt-1">e.g., 100gm, 1L</span>
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input
                            type="text"
                            value={quantity.price}
                            onChange={(e) => handleQuantityChange(index, "price", e.target.value)}
                            placeholder="Price"
                            className="w-full outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <input
                            type="text"
                            value={quantity.stocked_quantity}
                            onChange={(e) => handleQuantityChange(index, "stocked_quantity", e.target.value)}
                            placeholder="Stock Quantity"
                            className="w-full outline-none"
                          />
                          <span className="text-gray-500 text-sm mt-1">In stock count</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button color="primary" className="mt-4" onClick={handleAddQuantity}>Add Quantity</Button>
              </div>
            </div>
            <div className="flex justify-end py-4 px-6 gap-2">
              <Button color="primary" onClick={handleSubmit}>Submit</Button>
              <Button color="secondary" onClick={props.onClose}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default AddProductModal;
