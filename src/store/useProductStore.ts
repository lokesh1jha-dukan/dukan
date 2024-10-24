"use client";
import { NETWORK_STATES, fetchInsideTryCatch } from "@/lib/client/apiUtil";
import { CartItemQuantity, Category, Product, Quantity } from "@/types/client/types";
import { Cart } from "@/types/client/types";
import { create } from "zustand";

type NetworkState = (typeof NETWORK_STATES)[keyof typeof NETWORK_STATES];
interface ProductStore {
  products: Product[];
  cart: {
    data: Cart;
    status: NetworkState;
  };
  isCartSheetVisible: boolean;
  toggleCartSheet: (isOpen: boolean) => void;
  updateCart: (cartItems: Cart) => void;
  updateProductQuantityInCart: (
    product: Product,
    quantity: number,
    quantityId: number
  ) => void;
  updateProductQuantityLocal: (
    product: Product,
    quantity: number,
    quantityId: number
  ) => void;
}

interface CategoryStore {
  categories: Category[];
  categoryProducts: {
    data: Product[];
    status: NetworkState;
  };
  updateCategories: (categories: Category[]) => void;
  getProductsByCategory: (id: number) => void;
  updateCategoryProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  cart: {
    data: [],
    status: NETWORK_STATES.IDLE,
  },
  isCartSheetVisible: false,
  toggleCartSheet: (isOpen) => {
    set((state) => ({ isCartSheetVisible: isOpen }));
  },
  updateCart: (cartItems) => {
    set((state) => ({
      cart: { data: cartItems, status: NETWORK_STATES.IDLE },
    }));
  },
  updateProductQuantityLocal: (product, quantity, quantityId) => {
    // debugger
    let updatedQuantities:CartItemQuantity[]
    // console.log(quantity, quantityId, product, '====> updatedQuantities not')
    updatedQuantities = product.quantities.map((q) => {
        if (q.id === quantityId) {
          console.log(q,'====> q1')
          return { ...q, count: quantity };
        } else {
          console.log(q,'====> q')
          return {...q, count: q.count ? q.count : 0}
        }
      }) as CartItemQuantity[]
    set((state) => ({
      cart: {
        data: {
          ...state.cart.data,
          [product.id]: { ...product, quantities: updatedQuantities },
        },
        status: NETWORK_STATES.IDLE,
      }
    }))
  },
  updateProductQuantityInCart: async (product, quantity, quantity_id) => {
    set((state) => ({
      cart: { data: state.cart.data, status: NETWORK_STATES.LOADING },
    }));
    const data = await fetchInsideTryCatch(
      "api/cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantityId: quantity_id,
          quantity: quantity,
        }),
      },
      {
        retryDelay: 1000,
        maxRetries: 1,
      }
    );
    if (data && data.response.statusCode !== 200) {
      const cartState = get().cart.data;
      delete cartState[product.id];
      set((state) => ({
        cart: { data: cartState, status: NETWORK_STATES.ERROR },
      }));
    }
    set((state) => ({
      cart: { data: get().cart.data, status: NETWORK_STATES.SUCCESS },
    }));
  },
}));

async function getProductsByCategoryId(id: number): Promise<Product[]> {
  const result = await fetchInsideTryCatch<Product[]>(
    `api/product?categoryId=${id}`
  );
  if (result && result.response.statusCode === 200 && result.response.data) {
    return result.response.data;
  }
  return [];
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  categoryProducts: {
    data: [],
    status: NETWORK_STATES.IDLE,
  },

  updateCategories: (categories) => {
    set((state) => ({ categories }));
  },
  updateCategoryProducts: (products) => {
    set((state) => ({
      categoryProducts: { data: products, status: NETWORK_STATES.IDLE },
    }));
  },
  getProductsByCategory: async (id: number) => {
    set((state) => ({
      categoryProducts: {
        data: [],
        status: NETWORK_STATES.LOADING,
      },
    }));
    const products = await getProductsByCategoryId(id);
    set((state) => ({
      categoryProducts: {
        data: products,
        status: NETWORK_STATES.IDLE,
      },
    }));
  },
}));
