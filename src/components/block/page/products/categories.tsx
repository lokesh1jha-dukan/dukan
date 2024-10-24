"use client";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/store/useProductStore";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Products from "./products";
import { getProductsByCategoryId } from "@/lib/prisma";
import { useEffect, useState } from "react";
import {ClipLoader} from 'react-spinners'
import { useSearchParams } from "next/navigation";

type Props = {
    categories: { id: number; name: string }[];
};

const Categories = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const {
        categories,
        updateCategoryProducts,
        categoryProducts,
        updateCategories,
    } = useCategoryStore();
    const onCategoryClick = async (id: number) => {
        setLoading(true);
        const data = await getProductsByCategoryId(id);
        setLoading(false);
        if (data) {
            updateCategoryProducts(data);
        }
    };
    const params = useSearchParams()
    console.log(params.get('search'), "params12")

    

    useEffect(() => {
        onCategoryClick(props.categories[0].id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // api call for search
        console.log(params.get('search'), "params")
        // remove search from url
        if (params.get('search')) {
             }
    }, [params.get('search')]);

    return (
        <div className="grid grid-cols-8 gap-8 lg:grid-cols-9 lg:gap-6">
            <div className="flex flex-col gap-2 col-span-2 lg:col-span-3">
                {props.categories
                    .sort((a, b) =>
                        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
                    )
                    .map((category) => {
                        return (
                            <form
                                action={() => onCategoryClick(category.id)}
                                key={category.id}
                                className="w-full">
                                <Button
                                    className="w-full p-2 text-center whitespace-normal break-words h-fit"
                                    type="submit">
                                    {category.name.substring(0, 20)}
                                </Button>
                            </form>
                        );
                    })}
            </div>
            <div className="col-span-6">
                {loading ? (
                    <ClipLoader />
                ) : (
                    <Products productsData={categoryProducts.data} />
                )}
            </div>
        </div>
    );
};

export default Categories;
