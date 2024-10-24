"use client";
import ProductCard from "./productCard";
import { Product } from "@/types/client/types";

type Props = {
  productsData: Product[];
};

const Products = (props: Props) => {
 
  return (
    <>
      <div className="justify-start flex flex-wrap md:flex md:flex-wrap sm:flex sm:flex-wrap lg:grid lg:grid-flow-col gap-4">
        {props.productsData.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </>
  );
};

export default Products;
